import { createTool } from "@mastra/core/tools";
import { getXUrl } from "@repo/tools/get-x-url";

export const getXUrlTool = createTool({
	id: getXUrl.id,
	description: getXUrl.description,
	inputSchema: getXUrl.inputSchema,
	outputSchema: getXUrl.outputSchema,
	execute: async () => {
		return getXUrl.output;
	},
});
