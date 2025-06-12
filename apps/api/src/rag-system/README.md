# RAG System Utility App

This app is a standalone utility for document processing and Retrieval-Augmented Generation (RAG) using Mastra and OpenAI. It is designed to:

- Chunk and embed documents from `src/source-documents/`
- Store embeddings in a shared Postgres database (with pgvector)
- Provide scripts for processing, stats, and testing
- Remain isolated from the main API/app (not bundled or deployed with API)

## Usage

### 1. Install dependencies

```sh
pnpm install
```

### 2. Add your documents

Place Markdown, text, or HTML files in `src/source-documents/`.

### 3. Set environment variables

Create a `.env.development` file in this directory with:

```
VECTOR_POSTGRES_CONNECTION_STRING=postgresql://user:password@localhost:5432/database
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run scripts

- **Process all documents:**
  ```sh
  pnpm process-docs
  ```
- **Show stats:**
  ```sh
  pnpm rag-stats
  ```
- **Test query:**
  ```sh
  pnpm rag-test
  ```
- **Clear and reprocess:**
  ```sh
  pnpm rag-clear
  ```

## Integration

- This app only prepares and manages the vector database.
- Your main API/app can connect to the same Postgres DB and use the embeddings for RAG via Mastra tools.
- No code from this app is bundled or deployed with the main API.

## Structure

- `src/index.ts` — RAG system logic
- `src/process-documents.ts` — CLI utility for processing
- `src/source-documents/` — Your CV, project docs, etc.

---

**This app is for RAG data preparation only.** 

# Source Documents Directory

This directory contains source documents that will be processed by the RAG (Retrieval-Augmented Generation) system to provide context for Daniel Treviño Bergman's CV assistant.

## Supported File Types

The RAG system supports the following file formats:
- **Markdown** (`.md`) - CVs, project descriptions, technical documentation
- **Text** (`.txt`) - Plain text documents
- **HTML** (`.html`) - Web pages, formatted documents
- **JSON** (`.json`) - Structured data
- **PDF** (`.pdf`) - *Coming soon*

## How to Add Documents

1. **CV and Resume**: Add your CV in Markdown or PDF format
2. **Project Documentation**: Include project descriptions, case studies, and technical documentation
3. **Portfolio**: Add descriptions of your work, achievements, and experience
4. **Skills Documentation**: Include detailed information about your technical skills and expertise

## File Organization

You can organize files in subdirectories:
```
source-documents/
├── cv/
│   ├── daniel-cv.md
│   └── skills-overview.md
├── projects/
│   ├── project-1.md
│   └── project-2.md
├── experience/
│   ├── company-a.md
│   └── company-b.md
└── education/
    └── degrees.md
```

## Processing Documents

To process the documents and make them available to the RAG system:

1. **Initialize the RAG system** (run once):
   ```typescript
   import { ragSystem } from '../src/rag-system';
   await ragSystem.initialize();
   ```

2. **Process documents**:
   ```typescript
   await ragSystem.processDocuments();
   ```

3. **Query documents** (this is done automatically by the assistant agent):
   ```typescript
   const results = await ragSystem.query("frontend development experience");
   ```

## Document Format Tips

### For Markdown Files
- Use clear headings (`#`, `##`, `###`) to structure content
- Include relevant keywords for better search results
- Use bullet points for lists of skills or achievements

### Example CV Structure
```markdown
# Daniel Treviño Bergman

## Professional Summary
Brief overview of your experience and expertise...

## Technical Skills
- Frontend: React, TypeScript, Next.js
- Backend: Node.js, Python, PostgreSQL
- Cloud: AWS, Docker, Kubernetes

## Work Experience

### Senior Frontend Developer | Company Name
*2020 - Present*

- Developed React applications with TypeScript
- Led team of 5 developers
- Implemented CI/CD pipelines

## Projects

### Project Name
Description of the project, technologies used, and achievements...
```

## Important Notes

- Documents are automatically chunked for optimal retrieval
- Metadata like source file name and processing date are automatically added
- The system uses text-embedding-3-small for creating vector embeddings
- All content is stored in PostgreSQL with pgvector for similarity search

## Processing Status

Check the document processing status using:
```typescript
const stats = await ragSystem.getStats();
console.log(`Processed ${stats.documentCount} document chunks`);
``` 