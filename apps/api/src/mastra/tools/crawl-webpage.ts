import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const crawlWebpageTool = createTool({
	id: "crawl_webpage",
	description: "Crawls a webpage and extracts the text content",
	inputSchema: z.object({
		url: z.string().url(),
	}),
	outputSchema: z.object({
		html: z.string(),
	}),
	execute: async ({ context }) => {
		const response = await fetch(context.url);
		const html = await response.text();
		return { html };
	},
});