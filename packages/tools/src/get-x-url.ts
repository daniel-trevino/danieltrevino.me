import { z } from "zod";
import type { Tool } from "./types";

export const getXUrl: Tool = {
  id: "get_x_url",
  description: "Get Daniel Treviño Bergman's X (formely Twitter) profile URL",
  inputSchema: z.object({}),
  outputSchema: z.object({
    url: z.string(),
  }),
  output: {
    url: "https://x.com/danieltrevinob",
  },
};
