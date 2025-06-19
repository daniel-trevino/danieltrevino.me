"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
	HardDriveIcon,
	MoonIcon,
	MoreVerticalIcon,
	SunIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export function UserMenu() {
	const { setTheme: setCurrentTheme, theme: currentTheme } = useTheme();
	const [theme, setTheme] = useState<string>(currentTheme ?? "system");

	const colorModeOptions = [
		{
			value: "system",
			label: "System",
			icon: HardDriveIcon,
		},
		{
			value: "light",
			label: "Light",
			icon: SunIcon,
		},
		{
			value: "dark",
			label: "Dark",
			icon: MoonIcon,
		},
	];


	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex w-full items-center justify-between gap-2 rounded-md outline-hidden focus-visible:ring-2 focus-visible:ring-primary md:w-[100%+1rem] md:hover:bg-primary/5 cursor-pointer px-4 py-2"
					aria-label="User menu"
				>
					Settings
					<MoreVerticalIcon className="size-4" />
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuLabel>
					Daniel Treviño Bergman
					<span className="block font-normal text-xs opacity-70">AI Assistant</span>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Color mode selection */}
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<SunIcon className="mr-2 size-4" />
						Color Mode
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup
								value={theme}
								onValueChange={(value: string) => {
									setTheme(value);
									setCurrentTheme(value);
								}}
							>
								{colorModeOptions.map((option) => (
									<DropdownMenuRadioItem
										key={option.value}
										value={option.value}
									>
										<option.icon className="mr-2 size-4 opacity-50" />
										{option.label}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>

			</DropdownMenuContent>
		</DropdownMenu>
	);
}
