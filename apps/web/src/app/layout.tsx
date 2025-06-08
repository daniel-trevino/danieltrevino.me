import { QueryClientProvider } from "@/components/QueryClientProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatContextProvider } from "@/modules/chat/ChatContext";
import { ThreadSidebar } from "@/modules/thread/ThreadSidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Daniel Treviño Bergman",
	description:
		"Chat with Daniel's AI Agent which can provide information about his professional background, projects, and more.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<QueryClientProvider>
					<ChatContextProvider>
						<SidebarProvider>
							<ThreadSidebar />
							<div className="flex flex-col w-full">
								<SidebarTrigger className="size-10" />
								<div className="flex-1 md:pt-0 w-full max-w-7xl mx-auto px-4">
									{children}
								</div>
							</div>
						</SidebarProvider>
					</ChatContextProvider>
				</QueryClientProvider>
			</body>
		</html>
	);
}
