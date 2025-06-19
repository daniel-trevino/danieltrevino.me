import { QueryClientProvider } from "@/components/QueryClientProvider";
import { SidebarCustomProvider } from "@/components/SidebarCustomProvider";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChatContextProvider } from "@/modules/chat/ChatContext";
import { ThreadSidebar } from "@/modules/thread/ThreadSidebar";
import { AnalyticsScript } from "@/services/analytics";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
	openGraph: {
		title: "Daniel Treviño Bergman",
		description:
			"Chat with Daniel's AI Agent which can provide information about his professional background, projects, and more.",
		images: ["/og-image.png"],
	},
	description:
		"Chat with Daniel's AI Agent which can provide information about his professional background, projects, and more.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			{process.env.NODE_ENV === "production" && <AnalyticsScript />}
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					disableTransitionOnChange
					enableSystem
					defaultTheme="system"
					themes={["system", "light", "dark"]}
				>
					<QueryClientProvider>
						<ChatContextProvider>
							<SidebarCustomProvider>
								<ThreadSidebar />
								<div className="flex flex-col w-full">
									<div className="flex items-center justify-between">
										<div className="flex items-center justify-between gap-3 border-b w-full p-4">
											<SidebarTrigger />
											<div className="flex flex-col gap-1">
												<h1 className="font-bold text-2xl md:text-3xl">
													Daniel Treviño Bergman
												</h1>
												<p className="text-sm text-muted-foreground">
													Senior Software Engineer
												</p>
											</div>
											<Link href="/about">
												<Button variant="outline" className="cursor-pointer">
													About
												</Button>
											</Link>
										</div>
									</div>

									<div className="flex-1 md:pt-0 w-full max-w-7xl mx-auto px-4">
										{children}
									</div>
								</div>
							</SidebarCustomProvider>
						</ChatContextProvider>
					</QueryClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
