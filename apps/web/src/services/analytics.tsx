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

export function useAnalytics() {
	const [resourceId] = useResourceId();

	const trackEvent = (event: string, data?: Record<string, unknown>) => {
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
