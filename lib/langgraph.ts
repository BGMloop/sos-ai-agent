import { ChatMistralAI } from "@langchain/mistralai";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  trimMessages,
} from "@langchain/core/messages";
import {
  MessagesAnnotation,
  START,
  StateGraph,
  END,
} from "@langchain/langgraph";
import { MemorySaver } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import WxFlows from "@wxflows/sdk";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import SYSTEM_MESSAGE from "../constants/systemMessage";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { OpenAI } from "openai";
import fetch from "node-fetch";
import { ChatAnthropic } from "@langchain/anthropic";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const TOOL_SCHEMAS = {
  wikipedia: `extend schema @sdl(files: ["api/index.graphql"])`,
  google_books: `schema @sdl(files: ["api/index.graphql"]) { query: Query }`,
  youtube_transcript: `type Caption { dur: Float start: Float text: String } type Transcript { captions: [Caption] title: String } type Query { transcript(videoUrl: String!, langCode: String! = "en"): Transcript @rest( method: POST endpoint: "https://tactiq-apps-prod.tactiq.io/transcript" ) }`,
  math: `type Query { wolframAlpha(assumption: String, input: String!): WolframAlphaResult @graphql(endpoint: "https://carlose.us-east-a.ibm.stepzen.net/tool/wolframalpha/__graphql") }`,
  exchange: `schema @sdl(files: ["api/index.graphql"]) { query: Query }`,
  customerData: `type Query { customers: [Customer] @rest(endpoint: "https://introspection.apis.stepzen.com/customers") }`,
  dummyComments: `type Query { comments: [Comment] @rest(endpoint: "https://dummyjson.com/comments") }`
};

const messageCache = new Map<string, BaseMessage[]>();

const initTools = async () => {
  const toolClient = new WxFlows({
    endpoint: process.env.WXFLOWS_ENDPOINT || "",
    apikey: process.env.WXFLOWS_APIKEY,
    flowName: "mottled-terrier",
  });

  const wxTools = await toolClient.tools;
  const usedNames = new Set<string>();

  return wxTools.map(tool => {
    const toolName = tool.toString()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .substring(0, 64);

    let uniqueName = toolName;
    let counter = 1;
    while (usedNames.has(uniqueName)) {
      uniqueName = `${toolName}_${counter}`;
      counter++;
    }
    usedNames.add(uniqueName);

    return new DynamicStructuredTool({
      name: uniqueName,
      description: `Execute ${tool.toString()} operation`,
      schema: z.object({
        input: z.string().optional(),
        query: z.string().optional(),
        variables: z.record(z.any()).optional()
      }),
      func: async (input: any) => {
        const result = await toolClient.flow({
          schema: TOOL_SCHEMAS[tool.toString() as keyof typeof TOOL_SCHEMAS],
          variables: input,
          flowName: tool.toString()
        });
        return JSON.stringify(result);
      }
    });
  });
};

// Initialize tools lazily
let toolsPromise: Promise<DynamicStructuredTool[]> | null = null;

const getTools = () => {
  if (!toolsPromise) {
    toolsPromise = initTools();
  }
  return toolsPromise;
};

// Update toolNode creation
const createToolNode = async () => {
  const tools = await getTools();
  return new ToolNode(tools);
};

// Initialize embeddings with proper error handling
const embeddings = new MistralAIEmbeddings({
  apiKey: process.env.MISTRAL_API_KEY || '',
  modelName: "mistral-embed"
});

// Create text splitter with recommended settings
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2048,
  chunkOverlap: 200
});

// Function to create vector store from text content
async function createVectorStore(content: string) {
  try {
    const texts = await textSplitter.createDocuments([content]);
    return await MemoryVectorStore.fromDocuments(texts, embeddings);
  } catch (error) {
    console.error("Error creating vector store:", error);
    throw error;
  }
}

// Create Mistral model with specific configuration
const mistralModel = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY || '',
  modelName: "mistral-medium",
  temperature: 0.7,
});

const trimmer = trimMessages({
  maxTokens: 10,
  strategy: "last",
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
});

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  if (lastMessage.tool_calls?.length) {
    return "tools";
  }

  if (lastMessage._getType() === "tool") {
    return "agent";
  }

  return END;
}

// Update workflow creation
const createWorkflow = async () => {
  const workflow = new StateGraph(MessagesAnnotation);
  const toolNode = await createToolNode();

  workflow
    .addNode("agent", async (state) => {
      try {
        const messageContent = state.messages[0].content as string;
        
        const vectorStore = await createVectorStore(messageContent);
        const retriever = vectorStore.asRetriever();
        const relevantDocs = await retriever.getRelevantDocuments(messageContent);

        const systemContent = SYSTEM_MESSAGE + "\n\nRelevant context:\n" + 
          relevantDocs.map((doc: { pageContent: string }) => doc.pageContent).join("\n");

        const promptTemplate = ChatPromptTemplate.fromMessages([
          new SystemMessage(systemContent),
          new MessagesPlaceholder("messages"),
        ]);

        const trimmedMessages = await trimmer.invoke(state.messages);
        const prompt = await promptTemplate.invoke({ messages: trimmedMessages });
        
        // Get response from model
        const response = await mistralModel.invoke(prompt);
        
        // Check if response has tool calls in additional_kwargs
        const toolCalls = response.additional_kwargs?.tool_calls;
        if (toolCalls && toolCalls.length > 0) {
          // Return only tool_calls message
          const toolCallMessage = {
            role: "assistant" as const,
            tool_calls: toolCalls,
          };
          return { messages: [toolCallMessage] };
        }

        // Return only content message
        const contentMessage = {
          role: "assistant" as const,
          content: response.content || "",
        };
        return { messages: [contentMessage] };

      } catch (error) {
        console.error("Error in agent node:", error);
        throw error;
      }
    })
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");

  return workflow;
};

function addCachingHeaders(messages: BaseMessage[]): BaseMessage[] {
  if (!messages.length) return messages;

  const cachedMessages = [...messages];

  const addCache = (message: BaseMessage) => {
    message.content = [
      {
        type: "text",
        text: message.content as string,
        cache_control: { type: "ephemeral" },
      },
    ];
  };

  addCache(cachedMessages.at(-1)!);

  let humanCount = 0;
  for (let i = cachedMessages.length - 1; i >= 0; i--) {
    if (cachedMessages[i] instanceof HumanMessage) {
      humanCount++;
      if (humanCount === 2) {
        addCache(cachedMessages[i]);
        break;
      }
    }
  }

  return cachedMessages;
}

export async function submitQuestion(messages: BaseMessage[], chatId: string) {
  const cachedMessages = addCachingHeaders(messages);
  const workflow = await createWorkflow();
  const checkpointer = new MemorySaver();
  const app = workflow.compile({ checkpointer });

  const stream = await app.streamEvents(
    { messages: cachedMessages },
    {
      version: "v2",
      configurable: { thread_id: chatId },
      streamMode: "messages",
      runId: chatId,
    }
  );
  return stream;
}
