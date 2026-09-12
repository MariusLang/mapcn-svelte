<script lang="ts">
	import { untrack } from "svelte";
	import type { GeoJSONSource } from "maplibre-gl";
	import { useMap } from "./use-map.svelte.js";
	import { useMapRoute } from "./route-context.js";
	import { resolveBeforeId } from "./route.js";

	let {
		color,
		width,
		opacity,
		dashArray,
	}: {
		color?: string;
		width?: number;
		opacity?: number;
		dashArray?: [number, number];
	} = $props();
	const mapContext = useMap();
	const route = useMapRoute();
	const sourceId = $derived(`route-progress-source-${route.id}`);
	const layerId = $derived(`route-progress-layer-${route.id}`);
	const resolvedColor = $derived(color ?? route.color);
	const resolvedWidth = $derived(width ?? route.width);
	const resolvedOpacity = $derived(opacity ?? route.opacity);

	$effect(() => {
		const map = mapContext.map;
		if (!mapContext.isStyleReady || !route.ready || !map) return;
		const source = sourceId;
		const layer = layerId;
		const before = route.beforeId;
		map.addSource(source, {
			type: "geojson",
			data: {
				type: "Feature",
				properties: {},
				geometry: { type: "LineString", coordinates: untrack(() => route.traveled) },
			},
		});
		// Register before adding: active routes also observe synchronous styledata events.
		const unregister = route.registerLayer(layer);
		map.addLayer(
			{
				id: layer,
				type: "line",
				source,
				layout: { "line-join": "round", "line-cap": "round" },
				paint: untrack(() => ({
					"line-color": resolvedColor,
					"line-width": resolvedWidth,
					"line-opacity": resolvedOpacity,
					...(dashArray && { "line-dasharray": dashArray }),
				})),
			},
			resolveBeforeId(map, before)
		);
		return () => {
			unregister();
			try {
				if (map.getLayer(layer)) map.removeLayer(layer);
				if (map.getSource(source)) map.removeSource(source);
			} catch {
				/* Map may already be destroyed. */
			}
		};
	});

	$effect(() => {
		const map = mapContext.map;
		if (!mapContext.isStyleReady || !route.ready || !map) return;
		const source = map.getSource(sourceId) as GeoJSONSource | undefined;
		source?.setData({
			type: "Feature",
			properties: {},
			geometry: {
				type: "LineString",
				coordinates: route.traveled.length < 2 ? [] : route.traveled,
			},
		});
	});

	$effect(() => {
		const map = mapContext.map;
		if (!mapContext.isStyleReady || !route.ready || !map || !map.getLayer(layerId)) return;
		map.setPaintProperty(layerId, "line-color", resolvedColor);
		map.setPaintProperty(layerId, "line-width", resolvedWidth);
		map.setPaintProperty(layerId, "line-opacity", resolvedOpacity);
		map.setPaintProperty(layerId, "line-dasharray", dashArray);
	});
</script>
