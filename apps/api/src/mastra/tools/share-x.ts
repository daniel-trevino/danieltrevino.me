import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const SHARE_X_TOOL = createTool({
	id: "shareXTool",
	description: "Shares Daniel Treviño Bergman's X (formely Twitter) profile with the user. This tool should only be used if the user asks explicitly for the X profile.",
	inputSchema: z.object({}),
	outputSchema: z.object({
		url: z.string(),
	}),
	execute: async () => {
		return { url: 'https://x.com/danieI_trevino' };
	},
});