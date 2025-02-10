# SOS-AI-Agent


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
# [[ tool definition example ]]
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
"langchain": "^0.1.9",