import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const SHARE_CV_TOOL = createTool({
	id: "shareCvTool",
	description: "Shares Daniel Treviño Bergman's CV with the user. This tool should only be used if the user asks explicitly for the CV.",
	inputSchema: z.object({}),
	outputSchema: z.object({
		rawText: z.string(),
	}),
	execute: async () => {
		return { rawText: 'Here is the CV of Daniel Treviño Bergman.' };
	},
});