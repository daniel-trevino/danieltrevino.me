import { mastraClient } from "@/services/mastra-client";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, agentId, resourceId, threadId } = await req.json();

  const backendResponse = await mastraClient(`/api/agents/${agentId}/stream`, {
    method: "POST",
    body: {
      messages,
      resourceId,
      threadId,
    },
    signal: req.signal,
  });

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    headers: backendResponse.headers
  });
}
