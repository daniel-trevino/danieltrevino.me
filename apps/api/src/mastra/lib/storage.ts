import { PostgresStore } from "@mastra/pg";
import { config } from "dotenv";
import path from "node:path";

// Load environment variables from .env.development in development
if (process.env.NODE_ENV !== "production") {
	config({ path: path.resolve(process.cwd(), ".env.development") });
}

const connectionString = process.env
	.VECTOR_POSTGRES_CONNECTION_STRING as string;
 
export const storage = new PostgresStore({
  connectionString,
});