import type { Mastra as MastraType } from "@mastra/core";
import { Mastra } from "@mastra/core";
import { cors } from "../server/cors";
import { healthRoute } from "../server/custom-routes/health";
import { adminMiddleware } from "../server/middlewares/admin-auth";
import { loggerMiddleware } from "../server/middlewares/logger";
import { logger } from "../server/utils/logger";
import { assistantAgent } from "./agents/assistant-agent";
import { storage } from "./lib/storage";

export const mastra: MastraType = new Mastra({
	storage,
	agents: {
		assistantAgent,
	},
	server: {
		middleware: [loggerMiddleware, adminMiddleware],
		cors,
		port: process.env.PORT ? Number.parseInt(process.env.PORT) : 4111,
		host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
		apiRoutes: [healthRoute],
	},
	logger,
});
