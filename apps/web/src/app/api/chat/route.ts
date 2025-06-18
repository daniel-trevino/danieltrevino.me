import { mastraClient } from "@/services/mastra-client";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, agentId, resourceId, threadId } = await req.json();

  // We only need to send the last message to the mastra backend
  const lastMessage = messages[messages.length - 1];

  return mastraClient(`/api/agents/${agentId}/stream`, {
    method: "POST",
    body: {
      messages: lastMessage,
      resourceId,
      threadId,
    },
    signal: req.signal,
  });
}
