"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { FileUser, Loader2 } from "lucide-react";

type DownloadCVArgs = Record<string, never>;

type DownloadCVResult = {
	rawText: string;
};

export const ShareCVTool = makeAssistantToolUI<
	DownloadCVArgs,
	DownloadCVResult
>({
	toolName: "shareCvTool",
	render: ({ args, status, result }) => {
		if (status.type === "running") {
			return (
				<div className="flex items-center gap-2">
					<Loader2 className="h-4 w-4 animate-spin" />
					<span>Downloading CV...</span>
				</div>
			);
		}

		if (status.type === "incomplete" && status.reason === "error") {
			return <div className="text-red-500">Failed to provide CV</div>;
		}

		const handleDownload = async () => {
			try {
				const response = await fetch("/Daniel Treviño Bergman 2025.pdf");

				if (!response.ok) {
					throw new Error("File not found");
				}

				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement("a");

				link.href = url;
				link.download = "Daniel Treviño Bergman 2025.pdf";
				link.setAttribute("download", "Daniel Treviño Bergman 2025.pdf");

				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				// Clean up the blob URL
				window.URL.revokeObjectURL(url);
			} catch (error) {
				console.error("Download failed:", error);
				// Fallback to opening in new tab if download fails
				window.open("/Daniel Treviño Bergman 2025.pdf", "_blank");
			}
		};

		return (
			<div className="rounded-lg border bg-card p-6 shadow-sm">
				<div className="flex items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<FileUser className="h-6 w-6 text-primary" />
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-semibold">CV Download</h3>
						<p className="text-sm text-muted-foreground">
							✅ Ready to download
						</p>
					</div>
				</div>
				<div className="mt-4 space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">File name:</span>
						<span className="font-medium">Daniel Treviño Bergman 2025.pdf</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">Size:</span>
						<span className="font-medium">3.6mb</span>
					</div>
				</div>
				<div className="mt-4 flex gap-3">
					<button
						type="button"
						onClick={handleDownload}
						className="cursor-pointer flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
					>
						Download
					</button>
					<a
						href="/Daniel Treviño Bergman 2025.pdf"
						target="_blank"
						rel="noopener noreferrer"
						className="flex-1 rounded-md border border-primary bg-transparent px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-center inline-flex items-center justify-center"
					>
						Open
					</a>
				</div>
			</div>
		);
	},
});
