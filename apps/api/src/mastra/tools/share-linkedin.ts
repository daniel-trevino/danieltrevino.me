import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const SHARE_LINKEDIN_TOOL = createTool({
	id: "shareLinkedinTool",
	description: "Shares Daniel Treviño Bergman's LinkedIn profile with the user. This tool should only be used if the user asks explicitly for the LinkedIn profile.",
	inputSchema: z.object({}),
	outputSchema: z.object({
		url: z.string(),
	}),
	execute: async () => {
		return { url: 'https://www.linkedin.com/in/danieltrevino92/' };
	},
});