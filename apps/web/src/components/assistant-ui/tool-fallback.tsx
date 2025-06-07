import { cn } from "@/lib/utils";
import type { ToolCallContentPartComponent } from "@assistant-ui/react";
import { BlocksIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export const ToolFallback: ToolCallContentPartComponent = ({
	toolName,
	argsText,
	result,
}) => {
	const [isCollapsed, setIsCollapsed] = useState(true);
	const renameTool = toolName.replace(/brave/gi, "aigent");
	return (
		<div
			className={cn(
				"mb-2 flex flex-col rounded-lg border py-3 text-sm max-w-3xs md:max-w-full",
				{
					"gap-3": !isCollapsed,
				},
			)}
		>
			<div className="flex items-center gap-2 px-4">
				<BlocksIcon className="size-4 text-primary" />
				<p className="truncate">
					Used tool: <b>{renameTool}</b>
				</p>
				<div className="flex-grow" />
				<Button
					variant="ghost"
					size="icon"
					className="shrink-0"
					onClick={() => setIsCollapsed(!isCollapsed)}
				>
					{isCollapsed ? (
						<ChevronDownIcon className="size-4" />
					) : (
						<ChevronUpIcon className="size-4" />
					)}
				</Button>
			</div>
			<div
				className={`overflow-hidden transition-all ${isCollapsed ? "max-h-0" : "max-h-[1000px]"}`}
			>
				<div className="flex flex-col gap-2 border-t pt-2">
					<div className="px-4">
						<pre className="whitespace-pre-wrap break-words">{argsText}</pre>
					</div>
					{result !== undefined && (
						<div className="border-t border-dashed px-4 pt-2">
							<p className="font-semibold">Result:</p>
							<pre className="whitespace-pre-wrap break-words">
								{typeof result === "string"
									? result
									: JSON.stringify(result, null, 2)}
							</pre>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
