"use client";

import { useResourceId } from "@/hooks/use-resource-id";
import Script from "next/script";

const umamiTrackingId = process.env.NEXT_PUBLIC_UMAMI_TRACKING_ID as string;

export function AnalyticsScript() {
	return (
		<Script
			async
			type="text/javascript"
			data-website-id={umamiTrackingId}
			src="/script.js"
		/>
	);
}

export const analyticsEvents = {
	prompt_suggestion_clicked: "prompt_suggestion_clicked",
	knowledge_search_missed: "knowledge_search_missed",
} as const;

export function useAnalytics() {
	const [resourceId] = useResourceId();

	const trackEvent = (event: (typeof analyticsEvents)[keyof typeof analyticsEvents], data?: Record<string, unknown>) => {
		if (typeof window === "undefined" || !(window as any).umami) {
			return;
		}

		(window as any).umami.track(event, {
			...data,
			resourceId,
		});
	};

	return {
		trackEvent,
	};
}
