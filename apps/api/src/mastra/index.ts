import { ExperimentalEmptyAdapter } from "@copilotkit/runtime";
import { registerCopilotKit } from "@mastra/agui";
import type { Mastra as MastraType } from "@mastra/core";
import { Mastra } from "@mastra/core";
import { cors } from "../server/cors";
import { healthRoute } from "../server/custom-routes/health";
import { adminMiddleware } from "../server/middlewares/admin-auth";
import { loggerMiddleware } from "../server/middlewares/logger";
import { logger } from "../server/utils/logger";
import { agentCreator } from "./agents/agent-creator";
import { storage } from "./lib/storage";

const serviceAdapter = new ExperimentalEmptyAdapter();

export const mastra: MastraType = new Mastra({
	storage,
	agents: {
		agentCreator,
	},
	server: {
		middleware: [loggerMiddleware, adminMiddleware],
		cors,
		port: process.env.PORT ? Number.parseInt(process.env.PORT) : 4111,
		host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
		apiRoutes: [
			healthRoute,
			registerCopilotKit({
				path: "/copilotkit",
				resourceId: "agentCreator",
			}),
		],
	},
	logger,
});
