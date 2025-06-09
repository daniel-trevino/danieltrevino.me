import { z } from "zod";
import type { Tool } from "./types";

export const getGithubUrl: Tool = {
  id: "get_github_url",
  description: "Get Daniel Treviño Bergman's GitHub profile URL",
  inputSchema: z.object({}),
  outputSchema: z.object({
    url: z.string(),
  }),
  output: {
    url: "https://github.com/daniel-trevino",
  },
};
