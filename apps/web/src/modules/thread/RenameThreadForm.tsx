import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useChatContext } from "../chat/ChatContext";

interface RenameThreadFormProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
	threadId: string | null;
	placeholder?: string;
	autoFocus?: boolean;
}

export function RenameThreadForm({
	value,
	onChange,
	onSubmit,
	onCancel,
	threadId,
	placeholder = "Rename conversation...",
	autoFocus = true,
}: RenameThreadFormProps) {
	const { agentId, resourceId } = useChatContext();
	const queryClient = useQueryClient();

	const renameThreadMutation = useMutation({
		mutationFn: async () => {
			if (!threadId) throw new Error("Thread ID is required");
			if (!value.trim()) throw new Error("Thread title is required");

			const response = await fetch("/api/thread", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ agentId, threadId, title: value.trim() }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to rename thread");
			}

			return response.json();
		},
		onSuccess: () => {
			// Invalidate and refetch threads query
			queryClient.invalidateQueries({
				queryKey: ["threads", agentId, resourceId],
			});

			// Call the original onSubmit callback
			onSubmit({} as React.FormEvent);
		},
		onError: (error: Error) => {
			// Error handling can be extended here if needed
			console.error("Failed to rename thread:", error);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!value.trim()) return;
		renameThreadMutation.mutate();
	};

	return (
		<form onSubmit={handleSubmit} className="flex-1 flex gap-2">
			<Input
				value={value}
				onChange={onChange}
				className="flex-1 h-8 text-sm"
				autoFocus={autoFocus}
				placeholder={placeholder}
				disabled={renameThreadMutation.isPending}
				onBlur={onCancel}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						onCancel();
					}
				}}
			/>
			{renameThreadMutation.isError && (
				<div className="text-xs text-destructive mt-1">
					{renameThreadMutation.error?.message ||
						"Failed to rename conversation"}
				</div>
			)}
		</form>
	);
}
