"use client";

import { cn } from "@/lib/utils";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { Globe } from "lucide-react";

type BraveWebSearchArgs = {
	query: string;
};

type BraveWebSearchResult = {
	content: {
		type: "text";
		text: string;
	}[];
};

export const BraveWebSearchTool = makeAssistantToolUI<
	BraveWebSearchArgs,
	BraveWebSearchResult
>({
	toolName: "brave-search_brave_web_search",
	render: ({ args, status, result }) => {
		const Component = ({ isLoading }: { isLoading: boolean }) => {
			return (
				<div className="rounded-lg border bg-card p-2 md:p-6 shadow-sm my-2">
					<div className="flex items-start gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<Globe
								className={cn(
									"h-6 w-6 text-primary",
									isLoading && "animate-pulse",
								)}
							/>
						</div>
						<div className="flex-1">
							<h3 className="text-base md:text-lg font-semibold">
								Browsed Web
							</h3>
							<div className="mt-2 space-y-2">
								<div className="flex flex-col md:flex-row md:justify-start text-sm">
									<span className="text-muted-foreground">Query:</span>
									<span className="font-medium md:ml-2">{args.query}</span>
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
			return <div className="text-red-500">Failed to provide CV</div>;
		}

		return <Component isLoading={false} />;
	},
});
