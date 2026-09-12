import { getContext } from "svelte";
import type { Coordinates, RouteAnchor } from "./route.js";

export const ROUTE_CONTEXT = Symbol("map-route");
export type RouteContext = {
	id: string;
	ready: boolean;
	coordinates: Coordinates;
	traveled: Coordinates;
	progress: number | undefined;
	color: string;
	width: number;
	opacity: number;
	dashArray: [number, number] | undefined;
	beforeId: string | undefined;
	pointAt: (at: RouteAnchor) => [number, number] | null;
	registerLayer: (id: string) => () => void;
};

export function useMapRoute() {
	const context = getContext<RouteContext>(ROUTE_CONTEXT);
	if (!context) throw new Error("Route components must be used within MapRoute");
	return context;
}
