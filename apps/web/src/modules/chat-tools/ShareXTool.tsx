"use client";
import { Icons } from "@/components/icons";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

type ShareXArgs = Record<string, never>;

type ShareXResult = {
	url: string;
};

export const ShareXTool = makeAssistantToolUI<ShareXArgs, ShareXResult>({
	toolName: "shareXTool",
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
				className="rounded-lg border bg-white p-6 shadow-sm flex items-center gap-2 md:gap-6 max-w-md"
				style={{ borderColor: "#000000" }}
			>
				<div className="flex flex-col items-center justify-center mr-4">
					<Image
						src={"/profile-x.png"}
						width={64}
						height={64}
						alt="Profile"
						className="h-16 w-16 rounded-full object-cover border-2 border-[#000000]"
					/>
				</div>
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-[#000000] flex items-center gap-2">
						<Icons.twitter className="h-6 w-6" />
						@danieI_trevino
					</h3>
					<div className="flex gap-4 mb-4">
						<div className="flex flex-col items-center mt-2">
							<span className="font-bold text-[#000000] text-base">357</span>
							<span className="text-xs text-gray-500">Following</span>
						</div>
						<div className="flex flex-col items-center mt-2">
							<span className="font-bold text-[#000000] text-base">921</span>
							<span className="text-xs text-gray-500">Followers</span>
						</div>
					</div>
					<a
						href={result?.url}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center px-5 py-2 bg-[#000000] text-white rounded-full font-semibold shadow hover:bg-[#222] transition text-base"
					>
						Follow
					</a>
				</div>
			</div>
		);
	},
});
