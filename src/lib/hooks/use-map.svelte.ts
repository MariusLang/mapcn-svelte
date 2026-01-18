import { getContext } from "svelte";
import MapLibreGL from "maplibre-gl";

type MapContext = {
	getMap: () => MapLibreGL.Map | null;
	isLoaded: () => boolean;
};

export function useMap() {
	const mapCtx = getContext<MapContext>("map");

	const map = $derived.by(() => mapCtx?.getMap() ?? null);
	const isLoaded = $derived.by(() => mapCtx?.isLoaded() ?? false);

	return {
		get map() {
			return map;
		},
		get isLoaded() {
			return isLoaded;
		},
	};
}
