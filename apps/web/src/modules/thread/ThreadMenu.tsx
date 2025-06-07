import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { EditIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";

interface ThreadMenuProps {
	onRename: () => void;
	onDelete: () => void;
	className?: string;
	isActive?: boolean;
}

export function ThreadMenu({ onRename, onDelete, className }: ThreadMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className={cn(
						"cursor-pointer p-2 h-8 w-8 [&>svg]:size-4 flex items-center justify-center opacity-0 group-hover/thread:opacity-100 focus:opacity-100 focus-within:opacity-100 data-[state=open]:opacity-100 hover:bg-accent/50 rounded-md transition-opacity",
						className,
					)}
					onClick={(e) => e.stopPropagation()}
				>
					<MoreHorizontalIcon />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
						onRename();
					}}
				>
					<EditIcon className="h-4 w-4" />
					Rename
				</DropdownMenuItem>
				<DropdownMenuItem
					variant="destructive"
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
				>
					<TrashIcon className="h-4 w-4" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
