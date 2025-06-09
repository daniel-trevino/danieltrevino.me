"use client";

import { Thread } from "@/components/assistant-ui/thread";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { useEffect } from "react";
import { ChatTools } from "../chat-tools";
import { useChatContext } from "./ChatContext";
import { useMessages } from "./hooks/useMessages";
import { useThreads } from "./hooks/useThreads";

const ChatPageWithRuntime = ({ messages }: { messages: any }) => {
	const { threadId, agentId, resourceId } = useChatContext();
	const { refetch } = useThreads();

	const body = {
		agentId,
		threadId,
		resourceId,
	};

	const runtime = useChatRuntime({
		api: "/api/chat",
		initialMessages: messages,
		onResponse: () => {
			// We use this instead of nextjs router to avoid aborting the stream
			window.history.pushState(null, "", `/c/${threadId}`);
		},
		onFinish: async () => {
			// Reload the threads
			await refetch();
		},
		body,
	});

	return (
		<SidebarProvider defaultOpen>
			<AssistantRuntimeProvider runtime={runtime}>
				<ChatTools />
				<div className="w-full px-4">
					<Thread />
				</div>
			</AssistantRuntimeProvider>
		</SidebarProvider>
	);
};

export const ChatPage = ({ threadId }: { threadId?: string }) => {
	const { setThreadId, generateThreadId } = useChatContext();
	const { messages, isLoading } = useMessages(threadId);

	useEffect(() => {
		if (!threadId) {
			generateThreadId();
		}
	}, [threadId]);

	useEffect(() => {
		if (threadId) {
			setThreadId(threadId);
		}
	}, [threadId, setThreadId]);

	if (isLoading) {
		return null;
	}

	return <ChatPageWithRuntime key={threadId} messages={messages} />;
};
