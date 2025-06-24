import { createTool } from "@mastra/core/tools";
import { getDateTool } from "@repo/tools";

export const getDateToolMastra = createTool({
  id: getDateTool.id,
  inputSchema: getDateTool.inputSchema,
  outputSchema: getDateTool.outputSchema,
  description: getDateTool.description,
  execute: async () => {
    return getDateTool.output;
  },
});
