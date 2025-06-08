# RAG System Setup Guide

This guide explains how to set up and use the Retrieval-Augmented Generation (RAG) system built with Mastra's RAG SDK for Daniel Treviño Bergman's CV assistant.

## 🎯 Overview

The RAG system allows the assistant agent to search through Daniel's professional documents (CV, portfolio, project descriptions) to provide accurate, contextual responses about his experience and skills.

## 🏗️ Architecture

- **Document Processing**: Uses Mastra's `MDocument` for parsing and chunking
- **Vector Store**: PostgreSQL with pgvector extension for similarity search
- **Embeddings**: OpenAI's `text-embedding-3-small` model
- **Integration**: Custom tools for the assistant agent

## 📋 Prerequisites

1. **PostgreSQL with pgvector**: Ensure you have PostgreSQL with the pgvector extension installed
2. **Environment Variables**: Set up the required environment variables
3. **Dependencies**: Install the required packages

## 🔧 Installation

### 1. Install Dependencies

The following dependencies are already added to `package.json`:

```bash
npm install @mastra/rag ai
# or
pnpm install @mastra/rag ai
# or
bun install @mastra/rag ai
```

### 2. Environment Variables

Make sure your `.env.development` file includes:

```env
VECTOR_POSTGRES_CONNECTION_STRING=postgresql://user:password@localhost:5432/database
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. PostgreSQL Setup

Ensure your PostgreSQL database has the pgvector extension:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## 🚀 Usage

### 1. Add Documents

Place your documents in the `source-documents/` directory:

```
source-documents/
├── cv/
│   ├── daniel-cv.md
│   └── skills-overview.md
├── projects/
│   ├── ecommerce-rebuild.md
│   └── collaboration-tool.md
└── experience/
    ├── techcorp-role.md
    └── startup-experience.md
```

**Supported file types:**
- Markdown (`.md`) - Recommended for structured content
- Text (`.txt`) - Plain text documents
- HTML (`.html`) - Web pages and formatted content
- JSON (`.json`) - Structured data

### 2. Process Documents

Run the document processing script:

```bash
# Process all documents
npm run process-docs

# Or with options
npm run rag-stats    # Check current statistics
npm run rag-test     # Test query functionality
npm run rag-clear    # Clear and reprocess all documents
```

### 3. Using the Assistant Agent

The assistant agent now has access to two new tools:

#### `queryDocuments` Tool
Searches through processed documents for relevant information.

**Example queries:**
- "What is Daniel's experience with React?"
- "Tell me about his team leadership experience"
- "What projects has he worked on with TypeScript?"

#### `getDocumentStats` Tool
Provides information about the document database status.

## 🔍 How It Works

### Document Processing Pipeline

1. **File Discovery**: Recursively scans `source-documents/` for supported files
2. **Document Parsing**: Creates `MDocument` instances based on file type
3. **Chunking**: Splits documents into manageable pieces (512 tokens with 50 overlap)
4. **Embedding Generation**: Creates vector embeddings using OpenAI's model
5. **Storage**: Stores vectors and metadata in PostgreSQL with pgvector

### Query Pipeline

1. **Query Embedding**: Converts user query to vector embedding
2. **Similarity Search**: Finds most relevant document chunks
3. **Context Assembly**: Formats results with metadata and relevance scores
4. **Response Generation**: Agent uses context to generate informed responses

## 📊 Configuration

### RAG Configuration (in `src/rag-system/index.ts`)

```typescript
export const RAG_CONFIG = {
  indexName: "documents",
  dimension: 1536, // text-embedding-3-small dimension
  chunkSize: 512,
  chunkOverlap: 50,
  sourceDocsPath: path.join(process.cwd(), "source-documents"),
  embeddingModel: openai.embedding("text-embedding-3-small"),
};
```

### Assistant Agent Instructions

The agent is configured to:
- **Always use `queryDocuments` first** when answering questions about Daniel's experience
- **Use specific search terms** related to the user's question
- **Present search results with confidence scores**
- **Cite sources** when using information from document search

## 🛠️ API Reference

### RAGSystem Class

```typescript
import { ragSystem } from './src/rag-system';

// Initialize the system
await ragSystem.initialize();

// Process all documents
await ragSystem.processDocuments();

// Query documents
const results = await ragSystem.query("frontend development", {
  topK: 5,
  minScore: 0.7,
  filter: { fileType: '.md' }
});

// Get statistics
const stats = await ragSystem.getStats();

// Clear all documents
await ragSystem.clearDocuments();
```

### Tool Usage in Agent

```typescript
// The assistant agent automatically has access to these tools:
{
  queryDocuments: RAG_QUERY_TOOL,      // Search documents
  getDocumentStats: RAG_STATS_TOOL,    // Get database stats
}
```

## 🎯 Best Practices

### Document Organization

1. **Use Markdown** for structured content with clear headings
2. **Include keywords** relevant to searches (e.g., "React", "team leadership")
3. **Structure with headings** (`#`, `##`, `###`) for better chunking
4. **Keep sections focused** - one topic per section when possible

### Content Tips

1. **Be specific** about technologies, roles, and achievements
2. **Include metrics** and quantifiable results
3. **Use consistent terminology** across documents
4. **Add context** about projects and experiences

### Query Optimization

1. **Use specific terms** rather than generic ones
2. **Include technology names** for technical queries
3. **Mention time periods** for experience-based questions
4. **Be descriptive** about what you're looking for

## 🔧 Troubleshooting

### Common Issues

1. **No documents found**
   - Check that files are in `source-documents/` directory
   - Verify file extensions are supported
   - Run `npm run rag-stats` to check status

2. **Low relevance scores**
   - Add more specific keywords to documents
   - Ensure query terms match document content
   - Consider lowering `minScore` in queries

3. **Processing errors**
   - Check PostgreSQL connection
   - Verify OpenAI API key is valid
   - Ensure sufficient disk space for embeddings

### Debug Commands

```bash
# Check system status
npm run rag-stats

# Test queries
npm run rag-test

# Clear and reprocess
npm run rag-clear

# View processing logs
npm run process-docs
```

## 📈 Performance Considerations

### Vector Store Performance

- **Index Type**: Uses cosine similarity for semantic search
- **Chunk Size**: 512 tokens balances context and specificity
- **Embedding Model**: `text-embedding-3-small` provides good balance of speed/quality

### Scaling Considerations

- **Document Limit**: No hard limit, but performance may degrade with 10,000+ chunks
- **Query Speed**: Typically under 200ms for most queries
- **Storage**: Approximately 6KB per chunk (1536 dimensions × 4 bytes)

## 🔄 Maintenance

### Regular Tasks

1. **Update documents** as experience changes
2. **Reprocess documents** after major updates (`npm run rag-clear`)
3. **Monitor query performance** and adjust chunk size if needed
4. **Backup vector database** for disaster recovery

### Monitoring

```typescript
// Check system health
const stats = await ragSystem.getStats();
console.log(`Documents: ${stats.documentCount}`);
console.log(`Index: ${stats.indexName}`);
```

## 🚀 Next Steps

### Potential Enhancements

1. **PDF Support**: Add PDF parsing capabilities
2. **Semantic Reranking**: Implement result reranking for better relevance
3. **Metadata Filtering**: Add time-based or category-based filtering
4. **Analytics**: Track popular queries and improve content accordingly
5. **Auto-updates**: Automatically reprocess documents when files change

### Integration Ideas

1. **GitHub Integration**: Automatically process README files from repositories
2. **LinkedIn Sync**: Import and process LinkedIn profile data
3. **Portfolio Sync**: Automatically update from portfolio websites
4. **Real-time Updates**: Use file watchers to auto-process new documents

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs from `npm run process-docs`
3. Verify your environment variables and database connection
4. Test with the sample CV document provided

The RAG system is now ready to provide intelligent, context-aware responses about Daniel's professional experience! 🎉 