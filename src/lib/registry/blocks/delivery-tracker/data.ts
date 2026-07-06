export interface DeliveryMeal {
	name: string;
	price: string;
	quantity: number;
}

export interface OsrmRouteData {
	coordinates: [number, number][];
	duration: number;
	distance: number;
}

export const deliveryMeals: DeliveryMeal[] = [
	{ name: "Spicy Tofu Grain Bowl", price: "$44.00", quantity: 1 },
	{ name: "Herb Chicken Rice Box", price: "$58.00", quantity: 2 },
	{ name: "Roasted Veggie Wrap", price: "$29.00", quantity: 1 },
];

export const pickup = { lng: -122.4185, lat: 37.7645 };
export const dropoff = { lng: -122.434, lat: 37.7475 };

export const mapView = {
	center: [-122.4263, 37.756] as [number, number],
	zoom: 13.6,
	minZoom: 12,
	maxZoom: 15,
};

export const progressFraction = 0.62;

export function buildRouteUrl(
	from: { lng: number; lat: number },
	to: { lng: number; lat: number }
) {
	return `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
}

export const routeStyle = {
	progress: { color: "#3b82f6", width: 6, opacity: 0.95 },
	remaining: {
		width: 5.2,
		opacity: 0.5,
		color: { light: "#6b7280", dark: "#9ca3af" },
	},
} as const;
