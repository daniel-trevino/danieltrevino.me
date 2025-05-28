import { config } from "dotenv";
import type { Context, Next } from "hono";
import path from "node:path";
import { logger } from "../utils/logger";

// Load environment variables from .env.development in development
if (process.env.NODE_ENV !== "production") {
	config({ path: path.resolve(process.cwd(), ".env.development") });
}

const handler = async (c: Context, next: Next) => {
	const apiKey = c.req.header("x-api-key");
	const isFromMastraCloud = c.req.header("x-mastra-cloud") === "true";
	const isHealthEndpoint = c.req.path === "/health";
	const isDevEnvironment = process.env.APP_ENV !== "production";

	if (isFromMastraCloud || isHealthEndpoint || isDevEnvironment) {
		return next();
	}

	if (!apiKey) {
		logger.warn("Unauthorized, no api key provided", {
			apiKey,
		});
		return new Response("Unauthorized, no api key provided", { status: 401 });
	}

	const isAuthenticated = apiKey === process.env.ADMIN_API_KEY;

	if (!isAuthenticated) {
		logger.warn("Unauthorized, invalid api key", {
			apiKey,
		});
		return new Response("Unauthorized, invalid api key", { status: 401 });
	}

	// Continue to the next middleware or route handler
	await next();
};

export const adminMiddleware = {
	handler,
	path: "/*",
};
