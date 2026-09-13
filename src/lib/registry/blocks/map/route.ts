import type { Map } from "maplibre-gl";

export type RouteAnchor = "start" | "end" | "progress" | number;
export type Coordinates = [number, number][];
export type RouteMeasure = { cumulative: number[]; total: number };

export function resolveBeforeId(map: Map, beforeId: string | undefined) {
	return beforeId && map.getLayer(beforeId) ? beforeId : undefined;
}

/** Raise owned layers when membership changes, never in response to reordering. */
export function createRouteRaiser(map: Map, layers: () => string[], beforeId?: string) {
	let lastLayerSet = "";
	return () => {
		const order = map.getLayersOrder();
		const layerSet = [...order].sort().join("|");
		if (layerSet === lastLayerSet) return;
		lastLayerSet = layerSet;
		const owned = layers().filter((entry) => map.getLayer(entry));
		if (!owned.length) return;
		const before = resolveBeforeId(map, beforeId);
		const limit = before ? order.indexOf(before) : order.length;
		const top = order.slice(Math.max(0, limit - owned.length), limit);
		if (owned.every((entry, index) => top[index] === entry)) return;
		for (const entry of owned) map.moveLayer(entry, before);
	};
}

export function clampFraction(value: number) {
	return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

/** Equirectangular segment lengths, with longitude scaled by latitude. */
export function measureRoute(coordinates: Coordinates): RouteMeasure {
	if (coordinates.length < 2) return { cumulative: [], total: 0 };
	const cumulative = [0];
	let total = 0;
	for (let i = 1; i < coordinates.length; i++) {
		const [lng1, lat1] = coordinates[i - 1];
		const [lng2, lat2] = coordinates[i];
		const midLat = ((lat1 + lat2) / 2) * (Math.PI / 180);
		total += Math.hypot((lng2 - lng1) * Math.cos(midLat), lat2 - lat1);
		cumulative.push(total);
	}
	return { cumulative, total };
}

function findSegmentIndex(cumulative: number[], distance: number) {
	let low = 0;
	let high = cumulative.length - 1;
	while (low < high) {
		const mid = Math.floor((low + high) / 2);
		if (cumulative[mid] < distance) low = mid + 1;
		else high = mid;
	}
	return Math.min(low === 0 ? 0 : low - 1, cumulative.length - 2);
}

export function pointAtFraction(
	coordinates: Coordinates,
	measure: RouteMeasure,
	fraction: number
): [number, number] | null {
	if (coordinates.length === 0) return null;
	if (coordinates.length === 1 || measure.total === 0) return coordinates[0];
	const target = measure.total * clampFraction(fraction);
	const index = findSegmentIndex(measure.cumulative, target);
	const [lng1, lat1] = coordinates[index];
	const [lng2, lat2] = coordinates[index + 1];
	const segment = measure.cumulative[index + 1] - measure.cumulative[index];
	const ratio = segment === 0 ? 0 : (target - measure.cumulative[index]) / segment;
	return [lng1 + (lng2 - lng1) * ratio, lat1 + (lat2 - lat1) * ratio];
}

/** Interpolate the final point instead of snapping progress to a vertex. */
export function sliceAtFraction(
	coordinates: Coordinates,
	measure: RouteMeasure,
	fraction: number
): Coordinates {
	if (coordinates.length < 2) return [];
	const t = clampFraction(fraction);
	if (t <= 0 || measure.total === 0) return [];
	if (t >= 1) return coordinates;
	const index = findSegmentIndex(measure.cumulative, measure.total * t);
	const point = pointAtFraction(coordinates, measure, t);
	const traveled = coordinates.slice(0, index + 1);
	if (point) traveled.push(point);
	return traveled;
}
