export const visitorsByCountry: Record<string, number> = {
	// High
	Germany: 15,
	"United States": 14,
	China: 10,
	"United Kingdom": 12,
	India: 12,
	Japan: 12,
	Canada: 10,
	// Mid
	France: 9,
	Brazil: 9,
	Netherlands: 8,
	"Russian Federation": 8,
	Australia: 7,
	Indonesia: 7,
	Italy: 6,
	Sweden: 6,
	"South Africa": 6,
	Mexico: 5,
	// Low
	Poland: 4,
	Argentina: 4,
	Spain: 3,
	Egypt: 3,
	Greece: 2,
};

export const MAX_VISITORS = 15;

export type Theme = "light" | "dark";

interface ChoroplethColors {
	base: string;
	ramp: [string, string, string, string];
	hover: string;
}

export const mapConfig = {
	view: {
		center: [12, 28] as [number, number],
		zoom: 1.4,
		minZoom: 1,
		maxZoom: 4,
	},
	scaleStops: [0, 1, 5, 10, MAX_VISITORS] as const,
	colors: {
		light: {
			base: "#eef0f3",
			ramp: ["#d4d4d4", "#9e9e9e", "#6b6b6b", "#3d3d3d"],
			hover: "#0a0a0a",
		},
		dark: {
			base: "#2a2a2a",
			ramp: ["#3d3d3d", "#6b6b6b", "#9e9e9e", "#d4d4d4"],
			hover: "#ffffff",
		},
	} satisfies Record<Theme, ChoroplethColors>,
};
