"use client";

import { cn } from "@/lib/utils";
import { useAnalytics } from "@/services/analytics";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { knowledgeSearch } from "@repo/tools";
import { Brain } from "lucide-react";
import type { z } from "zod";

export const KnowledgeSearchTool = makeAssistantToolUI<
	z.infer<typeof knowledgeSearch.inputSchema>,
	z.infer<typeof knowledgeSearch.outputSchema>
>({
	toolName: knowledgeSearch.id,
	render: ({ status, result }) => {
		const Component = ({ isLoading }: { isLoading: boolean }) => {
			const { trackEvent } = useAnalytics();

			if (result && result.success === false) {
				trackEvent("knowledge_search_missed", {
					query: result.query,
				});
			}

			return (
				<div className="rounded-lg border bg-card p-2 md:p-6 shadow-sm my-2">
					<div className="flex items-center gap-4">
						<div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
							<Brain
								className={cn(
									"h-4 w-4 text-primary",
									isLoading && "animate-pulse",
								)}
							/>
						</div>
						<div className="flex-1">
							<h3 className="text-xs md:text-base font-semibold">
								{isLoading
									? "Thinking..."
									: `Knowledge Search: ${result?.resultCount || 0} results`}
							</h3>
						</div>
					</div>
				</div>
			);
		};

		if (status.type === "running") {
			return <Component isLoading={true} />;
		}

		if (status.type === "incomplete" && status.reason === "error") {
			return <div className="text-red-500">Failed to fetch knowledge</div>;
		}

		return <Component isLoading={false} />;
	},
});
