import type { z } from "zod";

export type Tool = {
  id: string;
  description: string;
  inputSchema: z.ZodSchema;
  outputSchema: z.ZodSchema;
  output: Record<string, unknown>;
};
