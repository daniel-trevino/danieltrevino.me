import { z } from "zod";
import { danielResume2025Markdown } from "./data/daniel-resume-2025";
import type { Tool } from "./types";

export const getDanielTrevinoResume: Tool = {
  id: "daniel_trevino_resume",
  description: "Returns the markdown content of Daniel Trevino's resume. Can be used to get information about his resume.",
  inputSchema: z.object({}),
  outputSchema: z.object({
    markdown: z.string(),
  }),
  output: {
    url: danielResume2025Markdown, // Special case calling this url instead of text
  },
};
