import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const SHARE_CV_TOOL = createTool({
	id: "shareCvTool",
	description: "Shares Daniel Treviño Bergman's CV with the user. This tool should only be used if the user asks explicitly for the CV.",
	inputSchema: z.object({}),
	outputSchema: z.object({
		url: z.string(),
	}),
	execute: async () => {
		return { url: 'https://danieltrevino.me/Daniel_Treviño_Bergman_2025.pdf' };
	},
});