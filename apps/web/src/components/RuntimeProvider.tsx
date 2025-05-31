"use client";

import {
  AssistantRuntimeProvider,
  type ChatModelAdapter,
  useLocalRuntime,
} from "@assistant-ui/react";
import type { ReactNode } from "react";

const MyModelAdapter: ChatModelAdapter = {
	async *run({ messages, abortSignal }) {
		const response = await fetch(
			"http://localhost:4111/api/agents/agentCreator/stream",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ messages }),
				signal: abortSignal,
			},
		);

		if (!response.body) throw new Error("No response body");

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let buffer = "";
		let text = "";

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			buffer += decoder.decode(value, { stream: true });

			const lines = buffer.split("\n");
			buffer = lines.pop()!; // last line may be incomplete

			for (const line of lines) {
				if (!line.trim()) continue;

				// Handle "f:" lines (metadata, can be ignored or used for messageId)
				if (line.startsWith("f:")) {
					// Optionally parse the messageId or other metadata
					continue;
				}

				// Handle "0:" lines (text chunks)
				if (line.startsWith("0:")) {
					// The part after 0: is a valid JSON string (e.g., "Hello")
					try {
						const chunk = JSON.parse(line.slice(2));
						text += chunk;
						yield {
							content: [
								{
									type: "text",
									text,
								},
							],
						};
					} catch (err) {
						// Optionally handle JSON parse errors
					}
				}
			}
		}
	},
};

export function RuntimeProvider({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const runtime = useLocalRuntime(MyModelAdapter);

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			{children}
		</AssistantRuntimeProvider>
	);
}
