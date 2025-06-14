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
  chunkSize: number; // Recommended: 120
  chunkOverlap: number; // Recommended: 40
  sourceDocsPath: string;
  embeddingModel: ReturnType<typeof openai.embedding>;
  topK: number;
  minScore: number;
}

export const RAG_CONFIG: RagConfig = {
  indexName: "documents",
  dimension: 1536,
  chunkSize: 120,
  chunkOverlap: 40,
  sourceDocsPath: join(__dirname, "source-documents"),
  embeddingModel: openai.embedding("text-embedding-3-small"),
  topK: 10,
  minScore: 0.6,
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

        // For markdown, prepend headers to chunk text and add to metadata
        if (ext === ".md") {
          chunks.forEach((chunk) => {
            const headers = [];
            if (chunk.metadata.title) headers.push(`# ${chunk.metadata.title}`);
            if (chunk.metadata.section) headers.push(`## ${chunk.metadata.section}`);
            if (chunk.metadata.subsection) headers.push(`### ${chunk.metadata.subsection}`);
            chunk.text = `${headers.join("\n")}${headers.length ? "\n" : ""}${chunk.text}`;

            // Extract date information for experience sections
            const dateInfo = this.extractDates(chunk.text, chunk.metadata);
            const recencyScore = this.calculateRecencyScore(dateInfo.startYear, dateInfo.endYear, dateInfo.isCurrentRole);

            chunk.metadata.title = chunk.metadata.title || null;
            chunk.metadata.section = chunk.metadata.section || null;
            chunk.metadata.subsection = chunk.metadata.subsection || null;
            chunk.metadata.startYear = dateInfo.startYear;
            chunk.metadata.endYear = dateInfo.endYear;
            chunk.metadata.isCurrentRole = dateInfo.isCurrentRole;
            chunk.metadata.recencyScore = recencyScore;
          });
        }

        if (chunks.length === 0) {
          console.warn(`⚠️ No chunks generated for ${path.basename(filePath)}`);
          continue;
        }

        // Generate embeddings for chunks
        const texts = chunks.map((chunk) => this.enhanceChunkForMatching(chunk));
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
   * Calculate section priority score
   */
  private getSectionPriority(sectionType: string | null): number {
    if (!sectionType) return 0;

    const section = sectionType.toLowerCase();

    // Professional experience gets highest priority
    if (section.includes('experience') || section.includes('professional')) return 0.15;

    // Technical skills and projects are also important
    if (section.includes('technical') || section.includes('skills')) return 0.10;
    if (section.includes('project')) return 0.08;

    // Education and other sections get lower priority
    if (section.includes('education')) return 0.05;

    return 0;
  }

  /**
   * Calculate query relevance multiplier based on semantic score
   */
  private getSemanticRelevanceMultiplier(semanticScore: number): number {
    // If semantic score is high, apply full boosts
    if (semanticScore >= 0.7) return 1.0;

    // If semantic score is medium, apply partial boosts  
    if (semanticScore >= 0.5) return 0.8;

    // If semantic score is low, reduce the impact of other boosts
    if (semanticScore >= 0.3) return 0.6;

    // Very low semantic scores get minimal boosts
    return 0.3;
  }

  /**
   * Calculate combined relevance score
   */
  private calculateCombinedScore(
    semanticScore: number,
    recencyScore: number,
    isCurrentRole: boolean,
    sectionType: string | null
  ): number {
    let score = semanticScore;

    // Get semantic relevance multiplier to balance boosts
    const semanticMultiplier = this.getSemanticRelevanceMultiplier(semanticScore);

    // Apply recency boost (scaled by semantic relevance)
    score = score + (recencyScore * 0.2 * semanticMultiplier);

    // Extra boost for current roles (scaled by semantic relevance)
    if (isCurrentRole) {
      score = score + (0.1 * semanticMultiplier);
    }

    // Apply section priority boost (scaled by semantic relevance)
    score = score + (this.getSectionPriority(sectionType) * semanticMultiplier);

    // Cap the score at 1.0
    return Math.min(score, 1.0);
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
    const { topK = RAG_CONFIG.topK, minScore = RAG_CONFIG.minScore, filter } = options;

    try {
      // Generate embedding for the query
      const { embeddings } = await embedMany({
        model: RAG_CONFIG.embeddingModel,
        values: [query],
      });

      // Query the vector store with higher topK to get more candidates for reranking
      const candidateTopK = Math.max(topK * 2, 20);
      const results = await this.vectorStore.query({
        indexName: this.indexName,
        queryVector: embeddings[0],
        topK: candidateTopK,
        filter,
        minScore: Math.max(minScore - 0.1, 0.1), // Lower threshold for candidates
      });

      // Re-rank results with combined scoring
      const rerankedResults = results
        .map((result) => {
          const semanticScore = result.score;
          const recencyScore = result.metadata?.recencyScore || 0;
          const isCurrentRole = result.metadata?.isCurrentRole || false;
          const sectionType = result.metadata?.section || result.metadata?.title;

          const combinedScore = this.calculateCombinedScore(
            semanticScore,
            recencyScore,
            isCurrentRole,
            sectionType
          );

          return {
            text: result.metadata?.text || "",
            metadata: {
              ...result.metadata,
              originalScore: semanticScore,
            },
            score: combinedScore,
          };
        })
        .filter(result => result.score >= minScore) // Apply final threshold
        .sort((a, b) => b.score - a.score) // Sort by combined score
        .slice(0, topK); // Take final topK

      return rerankedResults;
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

  /**
   * Extract dates from text content (for work experience sections)
   */
  private extractDates(
    text: string,
    metadata: any,
  ): {
    startYear: number | null;
    endYear: number | null;
    isCurrentRole: boolean;
  } {
    // Look for date patterns like "March 2025 - Present", "2020 - 2024", "October 2022 - October 2024"
    const datePatterns = [
      /(\w+\s+)?\d{4}\s*-\s*Present/i,
      /(\w+\s+)?\d{4}\s*-\s*(\w+\s+)?\d{4}/i,
      /\*(\w+\s+)?\d{4}\s*-\s*Present\*/i,
      /\*(\w+\s+)?\d{4}\s*-\s*(\w+\s+)?\d{4}\*/i,
    ];

    let startYear: number | null = null;
    let endYear: number | null = null;
    let isCurrentRole = false;

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        const fullMatch = match[0];

        // Check if it's a current role
        if (fullMatch.toLowerCase().includes("present")) {
          isCurrentRole = true;
          endYear = new Date().getFullYear();
        }

        // Extract years
        const yearMatches = fullMatch.match(/\d{4}/g);
        if (yearMatches && yearMatches.length > 0) {
          startYear = Number.parseInt(yearMatches[0]);
          if (yearMatches.length > 1 && !isCurrentRole) {
            endYear = Number.parseInt(yearMatches[1]);
          }
        }
        break;
      }
    }

    return { startYear, endYear, isCurrentRole };
  }

  /**
   * Calculate recency score (0-1, higher for more recent experiences)
   */
  private calculateRecencyScore(
    startYear: number | null,
    endYear: number | null,
    isCurrentRole: boolean,
  ): number {
    if (!startYear) return 0;

    const currentYear = new Date().getFullYear();
    const effectiveEndYear = endYear || currentYear;

    // Boost current roles
    if (isCurrentRole) return 1.0;

    // Calculate years since the role ended
    const yearsSinceEnd = currentYear - effectiveEndYear;

    // Exponential decay: roles from last 2 years get high scores
    if (yearsSinceEnd <= 2) return 0.9;
    if (yearsSinceEnd <= 5) return 0.7;
    if (yearsSinceEnd <= 10) return 0.5;
    return 0.3;
  }

  /**
   * Extract and enhance keywords from job titles and descriptions
   */
  private extractJobKeywords(text: string, metadata: any): string[] {
    const keywords: string[] = [];

    // Extract job titles and clean them
    const jobTitlePatterns = [
      /### ([^|]+) \|/g, // "### Tre | Frontend Developer Lead"
      /Frontend Developer/gi,
      /Web Developer/gi,
      /Software Engineer/gi,
      /Developer/gi,
      /Engineer/gi,
      /Lead/gi,
      /Senior/gi,
      /Principal/gi,
    ];

    jobTitlePatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          keywords.push(match[1].trim());
        } else {
          keywords.push(match[0].replace(/[^a-zA-Z\s]/g, '').trim());
        }
      }
    });

    // Extract technology keywords
    const techKeywords: string[] = [
      'React', 'TypeScript', 'JavaScript', 'Node.js', 'Next.js', 'Vue',
      'Angular', 'Frontend', 'Backend', 'Fullstack', 'Web3', 'Blockchain',
      'HTML', 'CSS', 'SCSS', 'Tailwind', 'Styled Components',
      'GraphQL', 'REST', 'API', 'MongoDB', 'PostgreSQL',
    ];

    techKeywords.forEach(tech => {
      if (text.toLowerCase().includes(tech.toLowerCase())) {
        keywords.push(tech);
      }
    });

    return [...new Set(keywords)]; // Remove duplicates
  }

  /**
   * Enhance chunk text with extracted keywords for better matching
   */
  private enhanceChunkForMatching(chunk: any): string {
    const keywords = this.extractJobKeywords(chunk.text, chunk.metadata);

    // Add keywords as searchable metadata at the end
    const keywordString = keywords.length > 0 ? `\n\nKeywords: ${keywords.join(', ')}` : '';

    return chunk.text + keywordString;
  }
}

// Export a singleton instance
export const ragSystem = new RAGSystem();
