"use client";

import { Icons } from "@/components/icons";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { getGithubUrl } from "@repo/tools/get-github-url";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import type { z } from "zod";

export const GetGithubUrlTool = makeAssistantToolUI<
	z.infer<typeof getGithubUrl.inputSchema>,
	z.infer<typeof getGithubUrl.outputSchema>
>({
	toolName: getGithubUrl.id,
	render: ({ status, result }) => {
		if (status.type === "running") {
			return (
				<div className="flex items-center gap-2">
					<Loader2 className="h-4 w-4 animate-spin" />
					<span>Thinking...</span>
				</div>
			);
		}

		if (status.type === "incomplete" && status.reason === "error") {
			return (
				<div className="text-red-500">Failed to provide LinkedIn profile</div>
			);
		}

		return (
			<div
				className="rounded-lg border bg-white p-6 shadow-sm flex items-center gap-2 md:gap-6 max-w-md mb-4"
				style={{ borderColor: "#24292f" }}
			>
				<div className="flex flex-col items-center justify-center mr-4">
					<Image
						src={"/profile-github.png"}
						width={64}
						height={64}
						alt="Profile"
						className="h-16 w-16 rounded-full object-cover border-2 border-[#24292f]"
					/>
				</div>
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-[#24292f] flex items-center gap-2">
						<Icons.github className="h-6 w-6" />
						daniel-trevino
					</h3>
					<a
						href={result?.url}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 inline-flex items-center px-5 py-2 bg-[#24292f] text-white rounded-full font-semibold shadow hover:bg-[#444d56] transition text-base"
					>
						Follow
					</a>
				</div>
			</div>
		);
	},
});
