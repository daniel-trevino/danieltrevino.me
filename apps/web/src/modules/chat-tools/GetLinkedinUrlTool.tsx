"use client";
import { Icons } from "@/components/icons";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { getLinkedinUrl } from "@repo/tools/get-linkedin-url";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import type { z } from "zod";

export const GetLinkedinUrlTool = makeAssistantToolUI<
	z.infer<typeof getLinkedinUrl.inputSchema>,
	z.infer<typeof getLinkedinUrl.outputSchema>
>({
	toolName: getLinkedinUrl.id,
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
				className="rounded-lg border bg-white dark:bg-zinc-900 p-6 shadow-sm flex items-center gap-2 md:gap-6 max-w-md mb-4"
				style={{ borderColor: "#0288D1" }}
			>
				<div className="flex flex-col items-center justify-center mr-4">
					<Image
						src={"/profile-linkedin.png"}
						width={64}
						height={64}
						alt="Profile"
						className="h-16 w-16 rounded-full object-cover border-2 border-[#0288D1]"
					/>
				</div>
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-[#0288D1] flex items-center gap-2">
						<Icons.linkedin className="h-6 w-6" />
						Daniel Treviño Bergman
					</h3>
					<p className="text-gray-700 dark:text-gray-100 text-sm mb-4">
						Senior Software Engineer
					</p>
					<a
						href={result?.url}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center px-5 py-2 bg-[#0288D1] text-white rounded-full font-semibold shadow hover:bg-[#0277BD] transition text-base"
					>
						Connect
					</a>
				</div>
			</div>
		);
	},
});
