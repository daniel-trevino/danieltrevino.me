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