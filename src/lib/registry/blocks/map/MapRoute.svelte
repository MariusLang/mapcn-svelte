<script lang="ts">
	import { getContext } from "svelte";
	import MapLibreGL from "maplibre-gl";

	interface Props {
		/** Optional unique identifier for the route layer */
		id?: string;
		/** Array of [longitude, latitude] coordinate pairs defining the route */
		coordinates: [number, number][];
		/** Line color as CSS color value (default: "#4285F4") */
		color?: string;
		/** Line width in pixels (default: 3) */
		width?: number;
		/** Line opacity from 0 to 1 (default: 0.8) */
		opacity?: number;
		/** Dash pattern [dash length, gap length] for dashed lines */
		dashArray?: [number, number];
		/** Callback when the route line is clicked */
		onclick?: () => void;
		/** Callback when mouse enters the route line */
		onmouseenter?: () => void;
		/** Callback when mouse leaves the route line */
		onmouseleave?: () => void;
		/** Whether the route is interactive - shows pointer cursor on hover (default: true) */
		interactive?: boolean;
	}

	let {
		coordinates,
		color = "#4285F4",
		width = 3,
		opacity = 0.8,
		dashArray,
		onclick,
		onmouseenter,
		onmouseleave,
		interactive = true,
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
		const paint: any = {
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

	// Handle click and hover events
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isLoaded();

		if (!loaded || !map || !interactive) return;

		const handleClick = () => {
			onclick?.();
		};
		const handleMouseEnter = () => {
			map.getCanvas().style.cursor = "pointer";
			onmouseenter?.();
		};
		const handleMouseLeave = () => {
			map.getCanvas().style.cursor = "";
			onmouseleave?.();
		};

		map.on("click", layerId, handleClick);
		map.on("mouseenter", layerId, handleMouseEnter);
		map.on("mouseleave", layerId, handleMouseLeave);

		return () => {
			map.off("click", layerId, handleClick);
			map.off("mouseenter", layerId, handleMouseEnter);
			map.off("mouseleave", layerId, handleMouseLeave);
		};
	});
</script>
