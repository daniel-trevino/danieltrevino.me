import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { ragSystem } from "../../rag-system";

export const RAG_QUERY_TOOL = createTool({
  id: "queryDocuments",
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
  execute: async ({ context }) => {
    try {
      const { query, topK, minScore, filter } = context;

      // Query the RAG system
      const results = await ragSystem.query(query, {
        topK,
        minScore,
        filter,
      });

      if (results.length === 0) {
        return {
          success: false,
          message: "No relevant information found for the given query.",
          results: [],
          suggestion: "Try rephrasing your query or using different keywords related to Daniel's professional experience.",
        };
      }

      // Format the results for the agent
      const formattedResults = results.map((result, index) => ({
        rank: index + 1,
        content: result.text,
        relevanceScore: result.score,
        originalScore: result.metadata.originalScore || result.score,
        source: result.metadata.source || "Unknown",
        fileType: result.metadata.fileType || "Unknown",
        section: result.metadata.title || result.metadata.section || null,
        isCurrentRole: result.metadata.isCurrentRole || false,
        startYear: result.metadata.startYear || null,
        endYear: result.metadata.endYear || null,
        recencyScore: result.metadata.recencyScore || 0,
      }));

      return {
        success: true,
        query,
        resultCount: results.length,
        results: formattedResults,
        summary: `Found ${results.length} relevant pieces of information about "${query}"`,
      };
    } catch (error) {
      console.error("Error querying RAG system:", error);
      return {
        success: false,
        message: "An error occurred while searching the documents.",
        error: error instanceof Error ? error.message : "Unknown error",
        results: [],
      };
    }
  },
});

// Additional tool for getting RAG system statistics
export const RAG_STATS_TOOL = createTool({
  id: "getDocumentStats",
  description: "Get statistics about the document database, including number of documents and processing status.",
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const stats = await ragSystem.getStats();
      return {
        success: true,
        indexName: stats.indexName,
        documentCount: stats.documentCount,
        vectorDimension: stats.dimension,
        status: stats.documentCount > 0 ? "Ready" : "No documents processed",
      };
    } catch (error) {
      return {
        success: false,
        message: "Could not retrieve document statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
}); 