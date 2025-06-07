"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { Loader2 } from "lucide-react";

type WeatherArgs = {
	location: string;
	unit: "fahrenheit" | "celsius"; // This doesn't exist on the mastra tool by default. So it doesn't work just out of the box.
};

type WeatherResult = {
	temperature: number;
	feelsLike: number;
	humidity: number;
	windSpeed: number;
	windGust: number;
	conditions: string;
	location: string;
};

export const WeatherTool = makeAssistantToolUI<WeatherArgs, WeatherResult>({
	toolName: "weatherTool",
	render: ({ args, status, result }) => {
		if (status.type === "running") {
			return (
				<div className="flex items-center gap-2">
					<Loader2 className="h-4 w-4 animate-spin" />
					<span>Checking weather in {args.location}...</span>
				</div>
			);
		}

		if (status.type === "incomplete" && status.reason === "error") {
			return (
				<div className="text-red-500">
					Failed to get weather for {args.location}
				</div>
			);
		}

		// Helper to map conditions to emojis
		const getWeatherEmoji = (
			condition?: string,
			temperature?: number,
			unit?: string,
		) => {
			if (!condition) return "";
			const c = condition.toLowerCase();

			// Temperature-based emojis
			if (temperature !== undefined) {
				const temp =
					unit === "fahrenheit" ? temperature : (temperature * 9) / 5 + 32;
				if (temp >= 90) return "🥵";
				if (temp <= 32) return "🥶";
			}

			// Condition-based emojis
			if (c.includes("sun") || c.includes("clear")) return "☀️";
			if (c.includes("cloud")) return "☁️";
			if (c.includes("rain")) return "🌧️";
			if (c.includes("storm") || c.includes("thunder")) return "⛈️";
			if (c.includes("snow")) return "❄️";
			if (c.includes("fog") || c.includes("mist")) return "🌫️";
			if (c.includes("wind")) return "💨";
			return "🌡️";
		};

		return (
			<div className="weather-card rounded-lg bg-blue-50 p-4">
				<h3 className="text-lg font-bold">{args.location}</h3>
				<div className="mt-2 grid grid-cols-2 gap-4">
					<div>
						<p className="text-2xl">
							{getWeatherEmoji(result?.conditions)} {result?.temperature}°
							{args.unit === "fahrenheit" ? "F" : "C"}
						</p>
					</div>
					<div className="text-sm">
						<p>Humidity: {result?.humidity}%</p>
						<p>Wind: {result?.windSpeed} km/h</p>
						<p>Wind Gust: {result?.windGust} km/h</p>
						<p>
							Feels Like: {result?.feelsLike}°
							{args.unit === "fahrenheit" ? "F" : "C"}
						</p>
						<p>Conditions: {result?.conditions}</p>
					</div>
				</div>
			</div>
		);
	},
});
