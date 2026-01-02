<script lang="ts">
	import { getContext } from "svelte";
	import MapLibreGL from "maplibre-gl";

	interface Props {
		coordinates: [number, number][];
		color?: string;
		width?: number;
		opacity?: number;
		dashArray?: [number, number];
		id?: string;
	}

	let {
		coordinates,
		color = "#4285F4",
		width = 3,
		opacity = 0.8,
		dashArray,
		id = crypto.randomUUID(),
	}: Props = $props();

	const mapCtx = getContext<{
		getMap: () => MapLibreGL.Map | null;
		isLoaded: () => boolean;
	}>("map");

	const sourceId = $derived(`route-source-${id}`);
	const layerId = $derived(`route-layer-${id}`);

	// Add route when map is ready
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isLoaded();

		if (!loaded || !map || coordinates.length < 2) return;

		// Remove existing layer and source if they exist
		if (map.getLayer(layerId)) map.removeLayer(layerId);
		if (map.getSource(sourceId)) map.removeSource(sourceId);

		// Add source
		map.addSource(sourceId, {
			type: "geojson",
			data: {
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates,
				},
			},
		});

		// Build paint options
		const paint: MapLibreGL.LinePaint = {
			"line-color": color,
			"line-width": width,
			"line-opacity": opacity,
		};

		if (dashArray) {
			paint["line-dasharray"] = dashArray;
		}

		// Add layer
		map.addLayer({
			id: layerId,
			type: "line",
			source: sourceId,
			layout: {
				"line-join": "round",
				"line-cap": "round",
			},
			paint,
		});

		return () => {
			try {
				if (map.getLayer(layerId)) map.removeLayer(layerId);
				if (map.getSource(sourceId)) map.removeSource(sourceId);
			} catch {
				// Ignore errors during cleanup
			}
		};
	});

	// Update route data when coordinates change
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isLoaded();

		if (!loaded || !map || coordinates.length < 2) return;

		const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource | undefined;
		if (source) {
			source.setData({
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates,
				},
			});
		}
	});

	// Update paint properties when they change
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isLoaded();

		if (!loaded || !map || !map.getLayer(layerId)) return;

		map.setPaintProperty(layerId, "line-color", color);
		map.setPaintProperty(layerId, "line-width", width);
		map.setPaintProperty(layerId, "line-opacity", opacity);

		if (dashArray) {
			map.setPaintProperty(layerId, "line-dasharray", dashArray);
		}
	});
</script>
