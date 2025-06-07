import { registerApiRoute } from "@mastra/core/server";

export const healthRoute: ReturnType<typeof registerApiRoute> = registerApiRoute("/health", {
	method: "GET",
	openapi: {
		tags: ["custom"],
		summary: "Health check",
		description: "Returns 200 if the server is healthy",
		responses: { 200: { description: "OK" } },
	},
	handler: async () => {
		return new Response("OK");
	},
});
