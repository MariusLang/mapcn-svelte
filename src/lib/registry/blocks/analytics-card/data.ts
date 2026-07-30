export interface VisitorLocation {
	city: string;
	lng: number;
	lat: number;
	visitors: number;
}

export const totalVisitors = "418.2K";
export const visitorGrowth = "+12%";

export const visitorLocations: VisitorLocation[] = [
	{ city: "San Francisco", lng: -122.4194, lat: 37.7749, visitors: 62 },
	{ city: "New York", lng: -74.006, lat: 40.7128, visitors: 58 },
	{ city: "Mexico City", lng: -99.1332, lat: 19.4326, visitors: 22 },
	{ city: "Sao Paulo", lng: -46.6333, lat: -23.5505, visitors: 30 },
	{ city: "London", lng: -0.1276, lat: 51.5074, visitors: 48 },
	{ city: "Berlin", lng: 13.405, lat: 52.52, visitors: 28 },
	{ city: "Madrid", lng: -3.7038, lat: 40.4168, visitors: 18 },
	{ city: "Lagos", lng: 3.3792, lat: 6.5244, visitors: 16 },
	{ city: "Dubai", lng: 55.2708, lat: 25.2048, visitors: 24 },
	{ city: "Mumbai", lng: 72.8777, lat: 19.076, visitors: 40 },
	{ city: "Singapore", lng: 103.8198, lat: 1.3521, visitors: 21 },
	{ city: "Tokyo", lng: 139.6917, lat: 35.6895, visitors: 38 },
	{ city: "Seoul", lng: 126.978, lat: 37.5665, visitors: 26 },
	{ city: "Sydney", lng: 151.2093, lat: -33.8688, visitors: 17 },
];
