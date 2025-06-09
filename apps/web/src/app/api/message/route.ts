import { transformMastraMessagesToAssistantUI } from "@/modules/chat/lib/mastra-messages-to-assistant-ui";
import { mastraClient } from "@/services/mastra-client";
import type { MastraMessageV2 } from "@mastra/core";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { agentId, threadId } = await req.json();

  const url = `/api/memory/threads/${threadId}/messages?agentId=${agentId}`;

  // Create AbortController with 3-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500);

  try {
    const response = await mastraClient(url, {
      method: "GET",
      signal: controller.signal,
    });

    // Clear the timeout if request completes successfully
    clearTimeout(timeoutId);

    if (response.status === 404) {
      return NextResponse.json([]);
    }

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const messagesResponse = await response.json();

    return NextResponse.json(transformMastraMessagesToAssistantUI(messagesResponse.messages as MastraMessageV2[]));
  } catch (error) {
    // Clear the timeout in case of any error
    clearTimeout(timeoutId);

    // If the request was aborted (timeout), return empty array
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json([]);
    }

    // Re-throw other errors
    throw error;
  }
}
