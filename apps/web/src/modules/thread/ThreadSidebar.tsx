"use client";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DeleteThreadForm } from "@/modules/thread/DeleteThreadForm";
import { RenameThreadForm } from "@/modules/thread/RenameThreadForm";
import { ThreadMenu } from "@/modules/thread/ThreadMenu";
import { SquarePenIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useChatContext } from "../chat/ChatContext";
import { useThreads } from "../chat/hooks/useThreads";

export function ThreadSidebar() {
	const { reset, threadId, generateThreadId } = useChatContext();
	const { threads, isLoading, error } = useThreads();
	const router = useRouter();

	// State for managing rename functionality
	const [renameThreadId, setRenameThreadId] = useState<string | null>(null);
	const [renameValue, setRenameValue] = useState("");

	// State for managing delete confirmation
	const [deleteThreadId, setDeleteThreadId] = useState<string | null>(null);

	const handleClick = useCallback(() => {
		// Push a new URL to the browser without reloading
		router.push("/");
		generateThreadId();
	}, [router, generateThreadId]);

	const handleRenameStart = useCallback((thread: any) => {
		setRenameThreadId(thread.id);
		setRenameValue(thread.title || thread.id);
	}, []);

	const handleRenameSubmit = useCallback(() => {
		setRenameThreadId(null);
		setRenameValue("");
	}, []);

	const handleRenameCancel = useCallback(() => {
		setRenameThreadId(null);
		setRenameValue("");
	}, []);

	// Remove the handleDeleteConfirm callback since deletion is now handled in DeleteThreadForm

	// Menu items.
	const items = [
		{
			title: "New Chat",
			onClick: handleClick,
			icon: SquarePenIcon,
		},
	];

	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<button type="button" onClick={item.onClick}>
											<item.icon />
											<span>{item.title}</span>
										</button>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* New group for threads */}
				<SidebarGroup>
					<SidebarGroupLabel>Conversations</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{isLoading && (
								<div className="px-4 py-2 text-sm text-muted-foreground">
									Loading threads...
								</div>
							)}
							{error && (
								<div className="px-4 py-2 text-sm text-destructive">
									Error loading threads
								</div>
							)}
							{!isLoading &&
								!error &&
								(!threads ||
									!Array.isArray(threads) ||
									threads.length === 0) && (
									<div className="px-4 py-2 text-sm text-muted-foreground">
										There is no conversations yet
									</div>
								)}
							{threads &&
								Array.isArray(threads) &&
								threads.length > 0 &&
								threads.map((thread: any) => (
									<SidebarMenuItem key={thread.id || thread.title}>
										{renameThreadId === thread.id ? (
											<div className="px-2 py-1">
												<RenameThreadForm
													value={renameValue}
													onChange={(e) => setRenameValue(e.target.value)}
													onSubmit={handleRenameSubmit}
													onCancel={handleRenameCancel}
													threadId={renameThreadId}
												/>
											</div>
										) : (
											<SidebarMenuButton
												asChild
												isActive={thread.id === threadId}
												className="w-full group/thread"
											>
												<Link
													href={thread.id ? `/${thread.id}` : "#"}
													className="flex items-center justify-between w-full"
												>
													<span className="truncate">
														{thread.title || thread.id}
													</span>
													<ThreadMenu
														onRename={() => handleRenameStart(thread)}
														onDelete={() => setDeleteThreadId(thread.id)}
														isActive={thread.id === threadId}
													/>
												</Link>
											</SidebarMenuButton>
										)}
									</SidebarMenuItem>
								))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<DeleteThreadForm
				open={!!deleteThreadId}
				onCancel={() => setDeleteThreadId(null)}
				onDelete={() => {
					setDeleteThreadId(null);
					reset();
					router.push("/");
				}}
				threadId={deleteThreadId}
				threadTitle={
					threads && Array.isArray(threads) && deleteThreadId
						? threads.find((t: any) => t.id === deleteThreadId)?.title ||
							deleteThreadId
						: undefined
				}
			/>
		</Sidebar>
	);
}
