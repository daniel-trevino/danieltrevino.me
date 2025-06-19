"use client";

import { cn } from "@/lib/utils";
import {
	ActionBarPrimitive,
	BranchPickerPrimitive,
	ComposerPrimitive,
	ErrorPrimitive,
	MessagePrimitive,
	ThreadPrimitive,
} from "@assistant-ui/react";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	CheckIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	CopyIcon,
	PencilIcon,
} from "lucide-react";
import type { FC } from "react";

import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnalytics } from "@/services/analytics";
import { motion } from "motion/react";
import { WordRotate } from "../magicui/word-rotate";
import { ToolFallback } from "./tool-fallback";

export const Thread: FC = () => {
	return (
		<ThreadPrimitive.Root
			className="bg-background box-border flex h-full flex-col overflow-hidden"
			style={{
				["--thread-max-width" as string]: "42rem",
			}}
		>
			<ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4">
				{/* Messages for non-empty threads */}
				<ThreadPrimitive.If empty={false}>
					<ThreadPrimitive.Messages
						components={{
							UserMessage: UserMessage,
							EditComposer: EditComposer,
							AssistantMessage: AssistantMessage,
						}}
					/>
					<div className="min-h-8 flex-grow" />
				</ThreadPrimitive.If>

				{/* Empty thread layout - centered welcome and input */}
				<ThreadPrimitive.If empty>
					<div className="flex h-full w-full max-w-[var(--thread-max-width)] flex-col">
						<div className="flex flex-grow flex-col items-center justify-center">
							<ThreadWelcome />
							<div className="mt-8 w-full">
								<Composer />
							</div>
							<div className="mt-6 w-full">
								<ThreadWelcomeSuggestions />
							</div>
						</div>
					</div>
				</ThreadPrimitive.If>

				{/* Normal composer for non-empty threads */}
				<ThreadPrimitive.If empty={false}>
					<div className="sticky bottom-0 mt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
						<ThreadScrollToBottom />
						<Composer />
					</div>
				</ThreadPrimitive.If>
			</ThreadPrimitive.Viewport>
		</ThreadPrimitive.Root>
	);
};

const ThreadScrollToBottom: FC = () => {
	return (
		<ThreadPrimitive.ScrollToBottom asChild>
			<TooltipIconButton
				tooltip="Scroll to bottom"
				variant="outline"
				className="absolute -top-8 rounded-full disabled:invisible"
			>
				<ArrowDownIcon />
			</TooltipIconButton>
		</ThreadPrimitive.ScrollToBottom>
	);
};

const ThreadWelcome: FC = () => {
	const messages = [
		"Your shortcut to understanding my qualifications.",
		"Curious about my background? Start a chat.",
		"Everything you need to know—one message away.",
		"Want to know what I've worked on?",
		"Explore my skills and story, ask anything.",
		"Got more questions before hiring me? Ask anything.",
	];
	return (
		<div className="text-center text-2xl font-bold">
			<WordRotate words={messages} duration={4000} />
		</div>
	);
};

const ThreadWelcomeSuggestions: FC = () => {
	const { trackEvent } = useAnalytics();

	const suggestions = [
		"Tell me about Daniel Treviño Bergman",
		"What is his professional experience?",
		"What is his tech stack?",
		"Give me his resume",
		"Give me his socials",
		"I want to contact him",
	];

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, x: -20 },
		show: { opacity: 1, x: 0 },
	};

	if (suggestions.length === 6) {
		const firstRow = suggestions.slice(0, 3);
		const secondRow = suggestions.slice(3, 6);
		return (
			<div className="flex flex-col gap-4 w-full items-center">
				<motion.div
					className="flex flex-col sm:flex-row gap-4 justify-center w-full"
					variants={container}
					initial="hidden"
					animate="show"
				>
					{firstRow.map((prompt) => (
						<motion.div
							key={prompt}
							variants={item}
							className="flex-1 min-w-0 max-w-lg"
						>
							<ThreadPrimitive.Suggestion
								className="hover:bg-muted/80 grid place-items-center rounded-lg border p-3 transition-colors ease-in cursor-pointer w-full"
								prompt={prompt}
								method="replace"
								autoSend
								onClick={() => trackEvent('prompt_suggestion_clicked', { prompt })}
							>
								<span className="line-clamp-2 text-ellipsis text-sm font-semibold">
									{prompt}
								</span>
							</ThreadPrimitive.Suggestion>
						</motion.div>
					))}
				</motion.div>
				<motion.div
					className="flex flex-col sm:flex-row gap-4 justify-center w-full"
					variants={container}
					initial="hidden"
					animate="show"
				>
					{secondRow.map((prompt) => (
						<motion.div
							key={prompt}
							variants={item}
							className="flex-1 min-w-0 max-w-lg"
						>
							<ThreadPrimitive.Suggestion
								className="hover:bg-muted/80 grid place-items-center rounded-lg border p-3 transition-colors ease-in cursor-pointer w-full"
								prompt={prompt}
								method="replace"
								autoSend
							>
								<span className="line-clamp-2 text-ellipsis text-sm font-semibold">
									{prompt}
								</span>
							</ThreadPrimitive.Suggestion>
						</motion.div>
					))}
				</motion.div>
			</div>
		);
	}

	// Default: grid with up to 4 columns, center items
	return (
		<motion.div
			className="mt-6 grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-center"
			variants={container}
			initial="hidden"
			animate="show"
		>
			{suggestions.map((prompt) => (
				<motion.div
					key={prompt}
					variants={item}
					className="flex-1 min-w-0 max-w-xs mx-auto"
				>
					<ThreadPrimitive.Suggestion
						className="hover:bg-muted/80 grid place-items-center rounded-lg border p-3 transition-colors ease-in cursor-pointer w-full"
						prompt={prompt}
						method="replace"
						autoSend
					>
						<span className="line-clamp-2 text-ellipsis text-sm font-semibold">
							{prompt}
						</span>
					</ThreadPrimitive.Suggestion>
				</motion.div>
			))}
		</motion.div>
	);
};

const Composer: FC = () => {
	const isMobile = useIsMobile();

	return (
		<ComposerPrimitive.Root className="focus-within:border-ring/20 flex w-full flex-wrap items-end rounded-lg border bg-inherit px-2.5 shadow-sm transition-colors ease-in">
			<ComposerPrimitive.Input
				rows={1}
				autoFocus={!isMobile}
				placeholder="Write a message..."
				className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 sm:text-sm text-base outline-none focus:ring-0 disabled:cursor-not-allowed"
			/>
			<ComposerAction />
		</ComposerPrimitive.Root>
	);
};

const ComposerAction: FC = () => {
	return (
		<>
			<ThreadPrimitive.If running={false}>
				<ComposerPrimitive.Send asChild>
					<TooltipIconButton
						tooltip="Send"
						variant="default"
						className="my-2.5 size-8 p-2 transition-opacity ease-in cursor-pointer rounded-full"
					>
						<ArrowUpIcon />
					</TooltipIconButton>
				</ComposerPrimitive.Send>
			</ThreadPrimitive.If>
			<ThreadPrimitive.If running>
				<ComposerPrimitive.Cancel asChild>
					<TooltipIconButton
						tooltip="Cancel"
						variant="default"
						className="my-2.5 size-8 p-2 transition-opacity ease-in cursor-pointer rounded-full"
					>
						<CircleStopIcon />
					</TooltipIconButton>
				</ComposerPrimitive.Cancel>
			</ThreadPrimitive.If>
		</>
	);
};

const UserMessage: FC = () => {
	return (
		<MessagePrimitive.Root className="grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] py-4">
			{/* <UserActionBar /> */}

			<div className="bg-muted text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words rounded-3xl px-5 py-2.5 col-start-2 row-start-2">
				<MessagePrimitive.Content />
			</div>

			<BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
		</MessagePrimitive.Root>
	);
};

const UserActionBar: FC = () => {
	return (
		<ActionBarPrimitive.Root
			hideWhenRunning
			autohide="not-last"
			className="flex flex-col items-end col-start-1 row-start-2 mr-3 mt-2.5"
		>
			<ActionBarPrimitive.Edit asChild>
				<TooltipIconButton tooltip="Edit">
					<PencilIcon />
				</TooltipIconButton>
			</ActionBarPrimitive.Edit>
		</ActionBarPrimitive.Root>
	);
};

const EditComposer: FC = () => {
	return (
		<ComposerPrimitive.Root className="bg-muted my-4 flex w-full max-w-[var(--thread-max-width)] flex-col gap-2 rounded-xl">
			<ComposerPrimitive.Input className="text-foreground flex h-8 w-full resize-none bg-transparent p-4 pb-0 outline-none" />

			<div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
				<ComposerPrimitive.Cancel asChild>
					<Button variant="ghost">Cancel</Button>
				</ComposerPrimitive.Cancel>
				<ComposerPrimitive.Send asChild>
					<Button>Send</Button>
				</ComposerPrimitive.Send>
			</div>
		</ComposerPrimitive.Root>
	);
};

const AssistantMessage: FC = () => {
	return (
		<MessagePrimitive.Root className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-4">
			<div className="text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-7 col-span-2 col-start-2 row-start-1 my-1.5">
				<MessagePrimitive.Content
					components={{ Text: MarkdownText, tools: { Fallback: ToolFallback } }}
				/>
				<MessageError />
			</div>

			<AssistantActionBar />

			<BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
		</MessagePrimitive.Root>
	);
};

const MessageError: FC = () => {
	return (
		<MessagePrimitive.Error>
			<ErrorPrimitive.Root className="border-destructive bg-destructive/10 dark:text-red-200 dark:bg-destructive/5 text-destructive mt-2 rounded-md border p-3 text-sm">
				<ErrorPrimitive.Message className="line-clamp-2" />
			</ErrorPrimitive.Root>
		</MessagePrimitive.Error>
	);
};

const AssistantActionBar: FC = () => {
	return (
		<ActionBarPrimitive.Root
			hideWhenRunning
			autohide="not-last"
			autohideFloat="single-branch"
			className="text-muted-foreground flex gap-1 col-start-3 row-start-2 -ml-1 data-[floating]:bg-background data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm"
		>
			<ActionBarPrimitive.Copy asChild>
				<TooltipIconButton tooltip="Copy">
					<MessagePrimitive.If copied>
						<CheckIcon />
					</MessagePrimitive.If>
					<MessagePrimitive.If copied={false}>
						<CopyIcon />
					</MessagePrimitive.If>
				</TooltipIconButton>
			</ActionBarPrimitive.Copy>
			{/* <ActionBarPrimitive.Reload asChild>
				<TooltipIconButton tooltip="Refresh">
					<RefreshCwIcon />
				</TooltipIconButton>
			</ActionBarPrimitive.Reload> */}
		</ActionBarPrimitive.Root>
	);
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
	className,
	...rest
}) => {
	return (
		<BranchPickerPrimitive.Root
			hideWhenSingleBranch
			className={cn(
				"text-muted-foreground inline-flex items-center text-xs",
				className,
			)}
			{...rest}
		>
			<BranchPickerPrimitive.Previous asChild>
				<TooltipIconButton tooltip="Previous">
					<ChevronLeftIcon />
				</TooltipIconButton>
			</BranchPickerPrimitive.Previous>
			<span className="font-medium">
				<BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
			</span>
			<BranchPickerPrimitive.Next asChild>
				<TooltipIconButton tooltip="Next">
					<ChevronRightIcon />
				</TooltipIconButton>
			</BranchPickerPrimitive.Next>
		</BranchPickerPrimitive.Root>
	);
};

const CircleStopIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 16 16"
			fill="currentColor"
			width="16"
			height="16"
		>
			<title>Stop</title>
			<rect width="10" height="10" x="3" y="3" rx="2" />
		</svg>
	);
};
