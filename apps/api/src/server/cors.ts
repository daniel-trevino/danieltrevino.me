export const cors = {
	origin: [
		"http://localhost:3001",
	], // Allow specific origins or '*' for all
	allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowHeaders: [
		"Content-Type",
		"Authorization",
		"x-copilotkit-runtime-client-gql-version"
	],
	credentials: false,
};
