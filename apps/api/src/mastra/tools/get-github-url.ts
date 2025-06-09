import { createTool } from "@mastra/core/tools";
import { getGithubUrl } from "@repo/tools/get-github-url";

export const getGithubUrlTool = createTool({
	id: getGithubUrl.id,
	description: getGithubUrl.description,
	inputSchema: getGithubUrl.inputSchema,
	outputSchema: getGithubUrl.outputSchema,
	execute: async () => {
		return getGithubUrl.output;
	},
});
