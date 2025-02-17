import { ConvexClient } from "convex/browser";
import { auth } from "@clerk/nextjs";

// Create a singleton instance of the Convex HTTP client
export async function getConvexClient() {
  const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  
  const { getToken } = auth();
  client.setAuth(async () => {
    return (await getToken({ template: "convex" })) ?? null;
  });
  
  return client;
}
