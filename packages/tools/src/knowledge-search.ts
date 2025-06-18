import { z } from "zod";
import type { Tool } from "./types";

export const knowledgeSearch: Tool = {
  id: "knowledge_search",
  description: `
    Search through Daniel Treviño Bergman's professional documents and CV information.
    Use this tool to find relevant information about his experience, skills, projects, and career background.
    This tool searches through processed documents including CVs, portfolios, and professional materials.
  `,
  inputSchema: z.object({
    query: z.string().describe("The search query to find relevant information about Daniel's professional background"),
    topK: z.number().optional().default(10).describe("Number of relevant results to return (default: 5)"),
    minScore: z.number().optional().default(0.6).describe("Minimum relevance score (0-1, default: 0.4)"),
    filter: z.record(z.any()).optional().describe("Optional metadata filters to narrow the search"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    resultCount: z.number(),
    query: z.string().describe("The search query to find relevant information about Daniel's professional background"),
    results: z.array(z.object({
      rank: z.number(),
      content: z.string(),
      relevanceScore: z.number(),
      source: z.string().describe("The source of the result"),
      fileType: z.string().describe("The type of the result"),
      section: z.string().describe("The section of the document that the result is from"),
    })),
  }),
};
