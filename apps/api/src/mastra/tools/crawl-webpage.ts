import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const CRAWL_WEBPAGE_TOOL = createTool({
	id: "Crawl Webpage",
	description: "Crawls a webpage and extracts the text content",
	inputSchema: z.object({
		url: z.string().url(),
	}),
	outputSchema: z.object({
		rawText: z.string(),
	}),
	execute: async ({ context, resourceId }) => {
		const response = await fetch(context.url);
		const text = await response.text();
		return { rawText: `This is the text content of the webpage: ${text}` };
	},
});