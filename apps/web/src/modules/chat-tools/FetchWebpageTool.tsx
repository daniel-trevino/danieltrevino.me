"use client";

import { cn } from "@/lib/utils";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { Globe } from "lucide-react";

type FetchWebpageArgs = {
	url: string;
	format: "html" | "markdown" | "txt" | "json";
	headers: Record<string, string>;
	max_length: number;
	start_index: number;
};

type FetchWebpageResult = {
	content: string;
	isError: boolean;
};

export const FetchWebpageTool = makeAssistantToolUI<
	FetchWebpageArgs,
	FetchWebpageResult
>({
	toolName: "fetch_webpage",
	render: ({ args, status }) => {
		const Component = ({ isLoading }: { isLoading: boolean }) => {
			return (
				<div className="rounded-lg border bg-card p-2 shadow-sm my-2">
					<div className="flex items-start gap-2">
						<div
							className={cn(
								"flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10",
								isLoading && "animate-pulse",
							)}
						>
							<Globe className="h-6 w-6 text-primary" />
						</div>
						<div className="flex-1">
							<h3 className="text-base font-semibold">
								{isLoading ? "Fetching Webpage..." : "Fetched Webpage"}
							</h3>
							<div className="space-y-2">
								<div className="flex flex-col md:flex-row md:justify-start text-sm">
									<span className="text-muted-foreground">URL:</span>
									<a
										className="font-medium md:ml-2 text-primary hover:underline"
										href={args.url}
										target="_blank"
									>
										{args.url}
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		};

		if (status.type === "running") {
			return <Component isLoading={true} />;
		}

		if (status.type === "incomplete" && status.reason === "error") {
			return <div className="text-red-500">Failed to fetch webpage</div>;
		}

		return <Component isLoading={false} />;
	},
});
