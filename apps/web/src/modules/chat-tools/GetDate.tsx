"use client";

import { cn } from "@/lib/utils";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { getDateTool } from "@repo/tools";
import { Globe } from "lucide-react";
import type { z } from "zod";

export const GetDateTool = makeAssistantToolUI<
	z.infer<typeof getDateTool.inputSchema>,
	z.infer<typeof getDateTool.outputSchema>
>({
	toolName: getDateTool.id,
	render: ({ status }) => {
		const Component = ({ isLoading }: { isLoading: boolean }) => {
			return (
				<div
					className={cn("p-2 md:p-2 my-2 mb-0", isLoading && "animate-pulse")}
				>
					<div className="flex items-center gap-2">
						<div className="flex h-6 w-6 items-center justify-center">
							<Globe className={cn("h-4 w-4 text-primary")} />
						</div>
						<div className="flex-1">
							<h3 className="text-xs md:text-sm font-semibold">
								Searching for date...
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
			return <div className="text-red-500">Failed to provide CV</div>;
		}

		return null;
	},
});
