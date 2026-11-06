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

export const pickup = { lng: -73.9445, lat: 40.6885 };
export const dropoff = { lng: -73.959, lat: 40.685 };

export const mapView = {
	bounds: [
		[dropoff.lng, dropoff.lat],
		[pickup.lng, pickup.lat],
	] as [[number, number], [number, number]],
	padding: 72,
	minZoom: 12,
	maxZoom: 15,
};

export const progressFraction = 0.45;

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
		color: { light: "#6b7280", dark: "#e5e7eb" },
	},
} as const;
