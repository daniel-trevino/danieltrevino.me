import { mastraClient } from "@/services/mastra-client";
import type { StorageThreadType } from "@mastra/core";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { agentId, resourceId } = await req.json();

  if (!agentId || !resourceId) {
    return NextResponse.json([]);
  }

  const backendResponse = await mastraClient(
    `/api/memory/threads?agentId=${agentId}&resourceid=${resourceId}`,
    {
      method: "GET",
    },
  );

  if (backendResponse.status === 404) {
    return NextResponse.json([]);
  }

  const threads = await backendResponse.json();

  const sortedThreads = threads.sort(
    (a: StorageThreadType, b: StorageThreadType) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return NextResponse.json(sortedThreads);
}

export async function DELETE(req: Request) {
  const { agentId, threadId } = await req.json();

  if (!agentId || !threadId) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const backendResponse = await mastraClient(
    `/api/memory/threads/${threadId}?agentId=${agentId}`,
    {
      method: "DELETE",
    },
  );

  if (!backendResponse.ok) {
    return NextResponse.json(
      { error: "Failed to delete thread" },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json({ success: true });
}


export async function PATCH(req: Request) {
  const { agentId, threadId, title } = await req.json();

  if (!agentId || !threadId || !title) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const backendResponse = await mastraClient(
    `/api/memory/threads/${threadId}?agentId=${agentId}`,
    {
      method: "PATCH",
      body: { title },
    },
  );

  if (!backendResponse.ok) {
    return NextResponse.json(
      { error: "Failed to update thread" },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json({ success: true });
}
