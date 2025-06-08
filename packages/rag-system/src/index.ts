import { openai } from "@ai-sdk/openai";
import { PgVector } from "@mastra/pg";
import { MDocument } from "@mastra/rag";
import { embedMany } from "ai";
import { config } from "dotenv";
import "dotenv/config";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path, { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  config({ path: path.resolve(process.cwd(), ".env.development") });
}

const connectionString = process.env
  .VECTOR_POSTGRES_CONNECTION_STRING as string;

const __dirname = dirname(fileURLToPath(import.meta.url));

// RAG Configuration
interface RagConfig {
  indexName: string;
  dimension: number;
  chunkSize: number;
  chunkOverlap: number;
  sourceDocsPath: string;
  embeddingModel: ReturnType<typeof openai.embedding>;
}

export const RAG_CONFIG: RagConfig = {
  indexName: "documents",
  dimension: 1536, // text-embedding-3-small dimension
  chunkSize: 512,
  chunkOverlap: 50,
  sourceDocsPath: join(__dirname, "source-documents"),
  embeddingModel: openai.embedding("text-embedding-3-small"),
};

// Initialize vector store
export const vectorStore = new PgVector({ connectionString });

/**
 * RAG System class to handle document processing and retrieval
 */
export class RAGSystem {
  private vectorStore: PgVector;
  private indexName: string;

  constructor() {
    this.vectorStore = vectorStore;
    this.indexName = RAG_CONFIG.indexName;
  }

  /**
   * Initialize the RAG system by creating the vector index
   */
  async initialize() {
    try {
      await this.vectorStore.createIndex({
        indexName: this.indexName,
        dimension: RAG_CONFIG.dimension,
        metric: "cosine",
      });
      console.log("✅ RAG system initialized successfully");
    } catch (error) {
      console.log("ℹ️ Index might already exist:", error);
    }
  }

  /**
   * Get supported file extensions
   */
  private getSupportedExtensions(): string[] {
    return [".md", ".txt", ".pdf", ".html", ".json"];
  }

  /**
   * Check if file is supported
   */
  private isSupportedFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return this.getSupportedExtensions().includes(ext);
  }

  /**
   * Read and process a single file
   */
  private async processFile(
    filePath: string,
  ): Promise<{ text: string; metadata: any }> {
    const content = readFileSync(filePath, "utf-8");
    const filename = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const metadata = {
      source: filename,
      filePath: filePath,
      fileType: ext,
      processedAt: new Date().toISOString(),
    };

    return { text: content, metadata };
  }

  /**
   * Get all files from source directory recursively
   */
  private getSourceFiles(dirPath: string): string[] {
    const files: string[] = [];

    try {
      const entries = readdirSync(dirPath);

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          // Recursively process subdirectories
          files.push(...this.getSourceFiles(fullPath));
        } else if (stat.isFile() && this.isSupportedFile(entry)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dirPath}:`, error);
    }

    return files;
  }

  /**
   * Process all documents in the source directory
   */
  async processDocuments(): Promise<void> {
    console.log("🔄 Starting document processing...");

    // Get all supported files
    const sourceFiles = this.getSourceFiles(RAG_CONFIG.sourceDocsPath);

    if (sourceFiles.length === 0) {
      console.warn("⚠️ No supported documents found in source directory");
      console.log(`📁 Looking for files in: ${RAG_CONFIG.sourceDocsPath}`);
      console.log(
        `📋 Supported extensions: ${this.getSupportedExtensions().join(", ")}`,
      );
      return;
    }

    console.log(`📊 Found ${sourceFiles.length} documents to process`);

    let totalChunks = 0;

    for (const filePath of sourceFiles) {
      try {
        console.log(`📄 Processing: ${path.basename(filePath)}`);

        // Read and process file
        const { text, metadata } = await this.processFile(filePath);

        // Create document and chunk it
        let doc: MDocument;
        const ext = path.extname(filePath).toLowerCase();

        // Create document based on file type
        switch (ext) {
          case ".md":
            doc = MDocument.fromMarkdown(text, metadata);
            break;
          case ".html":
            doc = MDocument.fromHTML(text, metadata);
            break;
          case ".json":
            doc = MDocument.fromJSON(text, metadata);
            break;
          default:
            doc = MDocument.fromText(text, metadata);
        }

        // Chunk the document
        const chunks = await doc.chunk({
          strategy: ext === ".md" ? "markdown" : "recursive",
          size: RAG_CONFIG.chunkSize,
          overlap: RAG_CONFIG.chunkOverlap,
          ...(ext === ".md" && {
            headers: [
              ["#", "title"],
              ["##", "section"],
              ["###", "subsection"],
            ],
          }),
        });

        if (chunks.length === 0) {
          console.warn(`⚠️ No chunks generated for ${path.basename(filePath)}`);
          continue;
        }

        // Generate embeddings for chunks
        const texts = chunks.map((chunk) => chunk.text);
        const { embeddings } = await embedMany({
          model: RAG_CONFIG.embeddingModel,
          values: texts,
        });

        // Prepare metadata for each chunk
        const chunkMetadata = chunks.map((chunk, index) => ({
          text: chunk.text,
          ...chunk.metadata,
          ...metadata,
          chunkIndex: index,
          totalChunks: chunks.length,
        }));

        // Store in vector database
        await this.vectorStore.upsert({
          indexName: this.indexName,
          vectors: embeddings,
          metadata: chunkMetadata,
        });

        totalChunks += chunks.length;
        console.log(
          `✅ Processed ${chunks.length} chunks from ${path.basename(filePath)}`,
        );
      } catch (error) {
        console.error(`❌ Error processing ${path.basename(filePath)}:`, error);
      }
    }

    console.log(
      `🎉 Document processing complete! Total chunks: ${totalChunks}`,
    );
  }

  /**
   * Query the RAG system
   */
  async query(
    query: string,
    options: {
      topK?: number;
      minScore?: number;
      filter?: Record<string, any>;
    } = {},
  ): Promise<Array<{ text: string; metadata: any; score: number }>> {
    const { topK = 5, minScore = 0.7, filter } = options;

    try {
      // Generate embedding for the query
      const { embeddings } = await embedMany({
        model: RAG_CONFIG.embeddingModel,
        values: [query],
      });

      // Query the vector store
      const results = await this.vectorStore.query({
        indexName: this.indexName,
        queryVector: embeddings[0],
        topK,
        filter,
        minScore,
      });

      return results.map((result) => ({
        text: result.metadata?.text || "",
        metadata: result.metadata || {},
        score: result.score,
      }));
    } catch (error) {
      console.error("Error querying RAG system:", error);
      return [];
    }
  }

  /**
   * Get statistics about the RAG system
   */
  async getStats(): Promise<{
    indexName: string;
    documentCount: number;
    dimension: number;
  }> {
    try {
      const stats = await this.vectorStore.describeIndex({
        indexName: this.indexName,
      });

      return {
        indexName: this.indexName,
        documentCount: stats.count,
        dimension: stats.dimension,
      };
    } catch (error) {
      console.error("Error getting RAG stats:", error);
      return {
        indexName: this.indexName,
        documentCount: 0,
        dimension: RAG_CONFIG.dimension,
      };
    }
  }

  /**
   * Clear all documents from the index
   */
  async clearDocuments(): Promise<void> {
    try {
      await this.vectorStore.deleteIndex({
        indexName: this.indexName,
      });
      await this.initialize();
      console.log("✅ RAG system cleared and reinitialized");
    } catch (error) {
      console.error("Error clearing RAG system:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const ragSystem = new RAGSystem();
