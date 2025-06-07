import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatContext } from "../chat/ChatContext";

interface DeleteThreadFormProps {
	open: boolean;
	onCancel: () => void;
	onDelete: () => void;
	threadId: string | null;
	threadTitle?: string;
}

export function DeleteThreadForm({
	open,
	// onOpenChange,
	onCancel,
	onDelete,
	threadId,
	threadTitle,
}: DeleteThreadFormProps) {
	const { agentId, resourceId } = useChatContext();
	const queryClient = useQueryClient();

	const deleteThreadMutation = useMutation({
		mutationFn: async () => {
			if (!threadId) throw new Error("Thread ID is required");

			const response = await fetch("/api/thread", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ agentId, resourceId, threadId }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to delete thread");
			}

			return response.json();
		},
		onSuccess: () => {
			// Invalidate and refetch threads query
			queryClient.invalidateQueries({
				queryKey: ["threads", agentId, resourceId],
			});

			// Close the dialog
			onDelete();
		},
		onError: (error: Error) => {
			// Error handling can be extended here if needed
			console.error("Failed to delete thread:", error);
		},
	});

	const handleDelete = () => {
		deleteThreadMutation.mutate();
	};

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Conversation</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete
						{threadTitle ? (
							<>
								{" "}
								<span className="font-semibold">{threadTitle}</span>
							</>
						) : null}
						? This action cannot be undone.
						{deleteThreadMutation.isError && (
							<div className="mt-2 text-sm text-destructive">
								{deleteThreadMutation.error?.message ||
									"Failed to delete conversation"}
							</div>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						disabled={deleteThreadMutation.isPending}
						onClick={onCancel}
					>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={deleteThreadMutation.isPending}
					>
						{deleteThreadMutation.isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
