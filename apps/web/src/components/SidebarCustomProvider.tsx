"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { useEffect, useState } from "react";
import { SidebarProvider } from "./ui/sidebar";

export const SidebarCustomProvider = ({
	children,
}: { children: React.ReactNode }) => {
	const [isOpen, setIsOpen] = useLocalStorage("sidebarState", false);
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	// During SSR and before hydration, use the default value
	const sidebarOpen = isHydrated ? isOpen : false;

	return (
		<SidebarProvider
			defaultOpen={sidebarOpen}
			open={sidebarOpen}
			onOpenChange={(open) => setIsOpen(open)}
		>
			{children}
		</SidebarProvider>
	);
};
