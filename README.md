# SOS AI Agent

This project wasn't built with the appropriate file path relative to the root of the repo. To fix the issue, I tried using files in serverless functions, but I was still getting errors with Vercel. To fix it, I built the appropriate file path relative to the root of the repo with sos-chatbot.github.io.

A sophisticated AI chat application built with Next.js, featuring real-time conversations, advanced prompt caching, and intelligent tool orchestration powered by LangChain and Claude 3.5 Sonnet.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
And Convex functions 
pnpm convex dev

Or:

pnpm dev instead of npm run dev
pnpm build instead of npm run build
pnpm test instead of npm run test

Explanation:
"dev": "next dev": Starts the Next.js development server.
"build": "next build": Creates an optimized production build.
"start": "next start": Starts the Next.js production server.
"lint": "next lint": Runs ESLint for code linting.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Technologies

- Next.js 14
- LangChain
- Claude 3.5 Sonnet
- Convex
- Clerk
- WxFlows

cd sos-ai-agent
-------------------------------------------------------------
cd wxflows

wxflows import curl https://" ".com

------------------------------------------------------------------------------------------------------------------------------------
WxflowsIndex.graphql
WxflowsTool.graphql
------------------------------------------------------------------------------------------------------------------------------------


------------------------------------------------------------------------------------------------------------------------------------
# From wxflows/tools.graphql
# [[ tools definition example ]]
# .
# Flows Engine allows creating LLM "tools" from parts of your GraphQL schema. To
# do that, add a field to the Query type, using the example below and replacing
# placeholders with something relevant for your tool.
# .
# extend type Query {
#   tool_name_definition: TC_GraphQL # <-- replace tool_name with something
#     @supplies(query: "tc_tools")
#     @materializer(
#       query: "tc_graphql_tool"
#       arguments: [
#         { name: "name", const: "[an internal tool name, e.g. 'wikipedia']" }
#         { name: "description", const: "[a description that helps LLMs to use this tool, e.g. 'Retrieve information from Wikipedia']" }
#         { name: "fields", const: "[a regex defining a subset of fields in this GraphQL schema, e.g. 'search|page' or 'mytool_.*']" }
#       ]
#     )
# }
# [[ end of tool definition example ]]

------------------------------------------------------------------------------------------------------------------------------------
llow Convex to properly authenticate with Clerk. The Issuer URL is used to verify JWT tokens from Clerk in your Convex backend.
To solve the CLERK_ISSUER_URL error, you need to:
Get your Clerk Issuer URL:
Go to Clerk Dashboard
Select your project
Go to "API Keys"
Copy the "Issuer URL" (it looks like https://your-project.clerk.accounts.dev)

then


Add it to Convex:
Add it to Convex:
Go to Convex Dashboard Environment Variables
Click "Add Environment Variable"
Name: CLERK_ISSUER_URL
Value: Paste your Clerk Issuer URL from step 1
------------------------------------------------------------------------------------------------------------------------------------
what I deleted "langchain": "link:wxflows/sdk/langchain",
