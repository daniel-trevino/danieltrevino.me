import type { Context, Next } from "hono";
import { logger } from "../utils/logger";
const handler = async (c: Context, next: Next) => {
	const start = Date.now();
	await next();
	const duration = Date.now() - start;
	logger.info(`${c.req.method} ${c.req.url} - ${duration}ms`);
};

export const loggerMiddleware = {
	handler,
	path: "/api/*",
};
