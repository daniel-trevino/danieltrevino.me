import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const SHARE_GITHUB_TOOL = createTool({
	id: "shareGithubTool",
	description: "Shares Daniel Treviño Bergman's GitHub profile with the user. This tool should only be used if the user asks explicitly for the GitHub profile.",
	inputSchema: z.object({}),
	outputSchema: z.object({
		url: z.string(),
	}),
	execute: async () => {
		return { url: 'https://github.com/daniel-trevino' };
	},
});