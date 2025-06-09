import { createTool } from "@mastra/core/tools";
import { getResumeUrl } from "@repo/tools";

export const getResumeUrlTool = createTool({
	id: getResumeUrl.id,
	description: getResumeUrl.description,
	inputSchema: getResumeUrl.inputSchema,
	outputSchema: getResumeUrl.outputSchema,
	execute: async () => {
		return getResumeUrl.output;
	},
});
