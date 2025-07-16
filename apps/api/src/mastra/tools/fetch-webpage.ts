import { createTool } from "@mastra/core/tools";
import { JSDOM } from "jsdom";
import is_ip_private from "private-ip";
import TurndownService from "turndown";
import { z } from "zod";

export const fetchWebpageTool = createTool({
	id: "fetch_webpage",
	description: "Fetches a webpage and extracts content in various formats (HTML, markdown, plain text, or JSON)",
	inputSchema: z.object({
		url: z.string().url(),
		format: z.enum(["html", "markdown", "txt", "json"]).default("html"),
		headers: z.record(z.string()).optional(),
		max_length: z.number().min(1).max(50000).default(5000),
		start_index: z.number().min(0).default(0),
	}),
	outputSchema: z.object({
		content: z.string(),
		isError: z.boolean(),
	}),
	execute: async ({ context }) => {
		try {
			// Security check to prevent fetching private IPs
			if (is_ip_private(context.url)) {
				throw new Error(
					`Fetch blocked an attempt to fetch a private IP ${context.url}. This is to prevent a security vulnerability where local tools could fetch privileged local IPs and exfiltrate data.`
				);
			}

			// Fetch the webpage with proper headers
			const response = await fetch(context.url, {
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
					...context.headers,
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}

			let content: string;

			// Process content based on format
			switch (context.format) {
				case "html": {
					content = await response.text();
					break;
				}
				case "json": {
					const json = await response.json();
					content = JSON.stringify(json);
					break;
				}
				case "txt": {
					const html = await response.text();
					const dom = new JSDOM(html);
					const document = dom.window.document;

					// Remove scripts and styles
					const scripts = document.getElementsByTagName("script");
					const styles = document.getElementsByTagName("style");
					Array.from(scripts).forEach((script) => (script as HTMLScriptElement).remove());
					Array.from(styles).forEach((style) => (style as HTMLStyleElement).remove());

					const text = document.body?.textContent || "";
					content = text.replace(/\s+/g, " ").trim();
					break;
				}
				case "markdown": {
					const html = await response.text();
					const turndownService = new TurndownService();
					content = turndownService.turndown(html);
					break;
				}
				default:
					throw new Error(`Unsupported format: ${context.format}`);
			}

			// Apply length limits
			if (context.start_index >= content.length) {
				content = "";
			} else {
				const end = Math.min(context.start_index + context.max_length, content.length);
				content = content.substring(context.start_index, end);
			}

			return {
				content,
				isError: false,
			};
		} catch (error) {
			return {
				content: error instanceof Error ? error.message : `Failed to fetch ${context.url}: Unknown error`,
				isError: true,
			};
		}
	},
});