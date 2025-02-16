import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { getConvexClient } from "../../../../lib/convex";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ChatInterface from "../../../../components/ChatInterface";

interface ChatPageProps {
  params: {
    chatId: Id<"chats">;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;

  // To get user authentication
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  try {
    // To get Convex client and fetch chat and messages
    const convex = getConvexClient();

    // To check if chat exists & user is authorized to view it
    const chat = await convex.query(api.chats.getChat, {
      id: chatId,
      userId,
    });

    if (!chat) {
      console.log(
        "⚠️ Chat was not found or unauthorized, redirecting to dashboard"
      );
      redirect("/dashboard");
    }

    // To get messages
    const initialMessages = await convex.query(api.messages.list, { chatId });

    return (
      <div className="flex-1 overflow-hidden">
        <ChatInterface chatId={chatId} initialMessages={initialMessages} />
      </div>
    );
  } catch (error) {
    console.error("🔥 Error loading chat:", error);
    redirect("/dashboard");
  }
}
