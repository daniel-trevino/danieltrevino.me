import { z } from "zod";
import type { Tool } from "./types";

export const getResumeUrl: Tool = {
  id: "get_resume_url",
  description: "Get Daniel Treviño Bergman's resume URL",
  inputSchema: z.object({}),
  outputSchema: z.object({
    url: z.string(),
  }),
  output: {
    url: "https://danieltrevino.me/Daniel_Treviño_Bergman_2025.pdf",
  },
};
