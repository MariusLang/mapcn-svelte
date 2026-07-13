/** Visitor counts keyed by the feature `NAME_LONG`. */
export const visitorsByCountry: Record<string, number> = {
	"United States": 100,
	Canada: 70,
	Brazil: 65,
	"United Kingdom": 95,
	Germany: 80,
	France: 55,
	India: 90,
	China: 45,
	Japan: 35,
	Australia: 25,
	"South Africa": 20,
	Egypt: 15,
};

export type Theme = "light" | "dark";

interface ChoroplethColors {
	/** Fill for countries with no data (value 0). */
	base: string;
	/** Sequential fill ramp from low to high, mapped to `scaleStops`. */
	ramp: [string, string, string, string];
	/** Fill for the hovered country. */
	hover: string;
}

export const mapConfig = {
	view: {
		center: [12, 28] as [number, number],
		zoom: 1.4,
		minZoom: 1,
		maxZoom: 4,
	},
	scaleStops: [0, 25, 50, 75, 100] as const,
	colors: {
		light: {
			base: "#f0f0f0",
			ramp: ["#d4d4d4", "#a3a3a3", "#737373", "#404040"],
			hover: "#0a0a0a",
		},
		dark: {
			base: "#2a2a2a",
			ramp: ["#404040", "#737373", "#a3a3a3", "#d4d4d4"],
			hover: "#ffffff",
		},
	} satisfies Record<Theme, ChoroplethColors>,
};
