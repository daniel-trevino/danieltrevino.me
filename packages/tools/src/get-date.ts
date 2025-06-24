import { z } from "zod";
import type { Tool } from "./types";

export const getDateTool: Tool = {
  id: "get_date",
  description: "Get the current date and time",
  inputSchema: z.object({}),
  outputSchema: z.object({
    date: z.string(),
  }),
  output: {
    date: new Date().toISOString(),
  },
};
