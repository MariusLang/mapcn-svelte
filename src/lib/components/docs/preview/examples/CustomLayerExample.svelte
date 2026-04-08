<script lang="ts">
	import { Map, MapControls } from "$lib/components/ui/map";
	import MapLibreGL from "maplibre-gl";
	import { Button } from "$lib/registry/ui/button";
	import Layers from "@lucide/svelte/icons/layers";
	import X from "@lucide/svelte/icons/x";
	import { onDestroy } from "svelte";

	const geojsonData = {
		type: "FeatureCollection" as const,
		features: [
			{
				type: "Feature" as const,
				properties: { name: "Central Park", type: "park" },
				geometry: {
					type: "Polygon" as const,
					coordinates: [
						[
							[-73.9731, 40.7644],
							[-73.9819, 40.7681],
							[-73.958, 40.8006],
							[-73.9493, 40.7969],
							[-73.9731, 40.7644],
						],
					],
				},
			},
			{
				type: "Feature" as const,
				properties: { name: "Bryant Park", type: "park" },
				geometry: {
					type: "Polygon" as const,
					coordinates: [
						[
							[-73.9837, 40.7536],
							[-73.9854, 40.7542],
							[-73.984, 40.7559],
							[-73.9823, 40.7553],
							[-73.9837, 40.7536],
						],
					],
				},
			},
		],
	};

	let mapInstance = $state<MapLibreGL.Map | null>(null);
	let isLayerVisible = $state(false);
	let hoveredPark: string | null = $state(null);
	let cleanupListeners: (() => void) | null = null;

	function handleStyleLoaded() {
		const map = mapInstance;
		if (!map) return;

		if (!map.getSource("parks")) {
			map.addSource("parks", { type: "geojson", data: geojsonData });
		}
		if (!map.getLayer("parks-fill")) {
			map.addLayer({
				id: "parks-fill",
				type: "fill",
				source: "parks",
				paint: { "fill-color": "#22c55e", "fill-opacity": 0.4 },
				layout: { visibility: "none" },
			});
		}
		if (!map.getLayer("parks-outline")) {
			map.addLayer({
				id: "parks-outline",
				type: "line",
				source: "parks",
				paint: { "line-color": "#16a34a", "line-width": 2 },
				layout: { visibility: "none" },
			});
		}

		const handleMouseEnter = () => {
			map.getCanvas().style.cursor = "pointer";
		};
		const handleMouseLeave = () => {
			map.getCanvas().style.cursor = "";
			hoveredPark = null;
		};
		const handleMouseMove = (e: MapLibreGL.MapMouseEvent) => {
			const features = map.queryRenderedFeatures(e.point, { layers: ["parks-fill"] });
			if (features.length > 0) hoveredPark = features[0].properties?.name || null;
		};

		map.on("mouseenter", "parks-fill", handleMouseEnter);
		map.on("mouseleave", "parks-fill", handleMouseLeave);
		map.on("mousemove", "parks-fill", handleMouseMove);

		cleanupListeners = () => {
			map.off("mouseenter", "parks-fill", handleMouseEnter);
			map.off("mouseleave", "parks-fill", handleMouseLeave);
			map.off("mousemove", "parks-fill", handleMouseMove);
		};
	}

	function toggleLayer() {
		const map = mapInstance;
		if (!map) return;
		const visibility = isLayerVisible ? "none" : "visible";
		map.setLayoutProperty("parks-fill", "visibility", visibility);
		map.setLayoutProperty("parks-outline", "visibility", visibility);
		isLayerVisible = !isLayerVisible;
	}

	onDestroy(() => {
		cleanupListeners?.();
	});
</script>

<div class="h-[420px] w-full">
	<Map
		center={[-73.97, 40.78]}
		zoom={11.8}
		bind:map={mapInstance}
		onstyleloaded={handleStyleLoaded}
	>
		<MapControls />
		<div class="absolute top-3 left-3 z-10">
			<Button size="sm" variant={isLayerVisible ? "default" : "secondary"} onclick={toggleLayer}>
				{#if isLayerVisible}
					<X class="mr-1.5 size-4" />
					Hide Parks
				{:else}
					<Layers class="mr-1.5 size-4" />
					Show Parks
				{/if}
			</Button>
		</div>
		{#if hoveredPark}
			<div
				class="bg-background/90 absolute bottom-3 left-3 z-10 rounded-md border px-3 py-2 text-sm font-medium backdrop-blur dark:bg-gray-900/90"
			>
				{hoveredPark}
			</div>
		{/if}
	</Map>
</div>
