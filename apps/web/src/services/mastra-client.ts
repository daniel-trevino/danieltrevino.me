export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type MastraClientConfig = Omit<RequestInit, "body"> & {
	body?: Record<string, unknown>;
	signal?: AbortSignal;
};

export const mastraClient = async (
	route: string,
	config: MastraClientConfig = {},
): Promise<Response> => {
	const baseUrl = process.env.MASTRA_API_URL?.replace(/\/$/, "");
	const url = `${baseUrl}${route.startsWith("/") ? route : `/${route}`}`;

	const { body, headers, signal, ...restConfig } = config;
	const apiKey = process.env.ADMIN_API_KEY as string;

	const response = await fetch(url, {
		...restConfig,
		signal,
		headers: {
			"Content-Type": "application/json",
			"x-api-key": apiKey,
			...(headers as Record<string, string>),
		},
		...(body && { body: JSON.stringify(body) }),
	});

	return response;
};
