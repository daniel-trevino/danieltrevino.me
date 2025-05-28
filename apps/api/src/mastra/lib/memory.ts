import { openai } from '@ai-sdk/openai';
import { Memory } from "@mastra/memory";
import { PgVector } from "@mastra/pg";
import { config } from "dotenv";
import path from "node:path";
import { storage } from "./storage";

// Load environment variables from .env.development in development
if (process.env.NODE_ENV !== "production") {
	config({ path: path.resolve(process.cwd(), ".env.development") });
}

const connectionString = process.env
	.VECTOR_POSTGRES_CONNECTION_STRING as string;

// Initialize memory with PostgreSQL storage and vector search
export const memory = new Memory({
	vector: new PgVector({ connectionString }),
	storage,
	embedder: openai.embedding('text-embedding-3-small'),
	options: {
		lastMessages: 20,
		threads: {
			generateTitle: true,
		},
		semanticRecall: {
			topK: 20,
			messageRange: 10,
		},
	},
});
