import { transformMastraMessagesToAssistantUI } from "@/modules/chat/lib/mastra-messages-to-assistant-ui";
import { mastraClient } from "@/services/mastra-client";
import type { MastraMessageV2 } from "@mastra/core";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { agentId, threadId } = await req.json();

  const url = `/api/memory/threads/${threadId}/messages?agentId=${agentId}`;

  const response = await mastraClient(url, {
    method: "GET",
  });


  if (response.status === 404) {
    return NextResponse.json([]);
  }

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  const messagesResponse = await response.json();

  return NextResponse.json(transformMastraMessagesToAssistantUI(messagesResponse.messages as MastraMessageV2[]));
}
