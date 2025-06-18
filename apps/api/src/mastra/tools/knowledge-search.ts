import { createTool } from "@mastra/core/tools";
import { knowledgeSearch } from "@repo/tools";
import { z } from "zod";
import { ragSystem } from "../../rag-system";

export const knowledgeSearchTool = createTool({
  id: knowledgeSearch.id,
  description: knowledgeSearch.description,
  inputSchema: knowledgeSearch.inputSchema,
  outputSchema: knowledgeSearch.outputSchema,
  execute: async ({ context }) => {
    const { query, topK, minScore, filter } = context;
    try {
      // Query the RAG system
      const results = await ragSystem.query(query, {
        topK,
        minScore,
        filter,
      });

      if (results.length === 0) {
        return {
          success: false,
          query,
          resultCount: 0,
          results: [],
          message: "No relevant information found for the given query. Try rephrasing your query or using different keywords related to Daniel's professional experience.",
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
        message: `Found ${results.length} relevant pieces of information about "${query}"`,
      };
    } catch (error) {
      console.error("Error querying RAG system:", error);
      return {
        success: false,
        query,
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