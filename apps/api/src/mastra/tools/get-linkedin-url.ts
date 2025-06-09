import { createTool } from "@mastra/core/tools";
import { getLinkedinUrl } from "@repo/tools/get-linkedin-url";

export const getLinkedinUrlTool = createTool({
	id: getLinkedinUrl.id,
	description: getLinkedinUrl.description,
	inputSchema: getLinkedinUrl.inputSchema,
	outputSchema: getLinkedinUrl.outputSchema,
	execute: async () => {
		return getLinkedinUrl.output;
	},
});
