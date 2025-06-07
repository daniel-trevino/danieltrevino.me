import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const DOWNLOAD_CV_TOOL = createTool({
	id: "downloadCvTool",
	description: "Downloads Daniel Treviño Bergman's CV from his website",
	inputSchema: z.object({}),
	outputSchema: z.object({
		rawText: z.string(),
	}),
	execute: async () => {
		return { rawText: 'Here is the CV of Daniel Treviño Bergman.' };
	},
});