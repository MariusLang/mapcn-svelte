export const visitorsByCountry: Record<string, number> = {
	Germany: 15,
	"United States": 14,
	"United Kingdom": 12,
	India: 9,
	France: 9,
	Australia: 8,
	Netherlands: 8,
	Spain: 7,
	Italy: 6,
	Sweden: 6,
	Poland: 4,
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
			ramp: ["#d4d4d4", "#a3a3a3", "#525252", "#262626"],
			hover: "#0a0a0a",
		},
		dark: {
			base: "#2e2e2e",
			ramp: ["#404040", "#7d7d7d", "#b8b8b8", "#ededed"],
			hover: "#ffffff",
		},
	} satisfies Record<Theme, ChoroplethColors>,
};
