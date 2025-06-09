import { z } from "zod";
import type { Tool } from "./types";

export const getLinkedinUrl: Tool = {
  id: "get_linkedin_url",
  description: "Get Daniel Treviño Bergman's LinkedIn profile URL",
  inputSchema: z.object({}),
  outputSchema: z.object({
    url: z.string(),
  }),
  output: {
    url: "https://www.linkedin.com/in/danieltrevino92/",
  },
};
