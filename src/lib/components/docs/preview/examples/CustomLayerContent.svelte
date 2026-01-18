<script lang="ts">
	import { getContext } from "svelte";
	import MapLibreGL from "maplibre-gl";
	import { Button } from "$lib/registry/ui/button";
	import Layers from "@lucide/svelte/icons/layers";
	import X from "@lucide/svelte/icons/x";

	interface Props {
		geojsonData: GeoJSON.FeatureCollection;
	}

	let { geojsonData }: Props = $props();

	const mapCtx = getContext<{
		getMap: () => MapLibreGL.Map | null;
		isLoaded: () => boolean;
	}>("map");

	let isLayerVisible = $state(false);
	let hoveredPark: string | null = $state(null);

	$effect(() => {
		const map = mapCtx?.getMap();
		if (!map || !mapCtx?.isLoaded()) return;

		// Add source if it doesn't exist
		if (!map.getSource("parks")) {
			map.addSource("parks", {
				type: "geojson",
				data: geojsonData,
			});
		}

		// Add fill layer if it doesn't exist
		if (!map.getLayer("parks-fill")) {
			map.addLayer({
				id: "parks-fill",
				type: "fill",
				source: "parks",
				paint: {
					"fill-color": "#22c55e",
					"fill-opacity": 0.4,
				},
				layout: {
					visibility: isLayerVisible ? "visible" : "none",
				},
			});
		}

		// Add outline layer if it doesn't exist
		if (!map.getLayer("parks-outline")) {
			map.addLayer({
				id: "parks-outline",
				type: "line",
				source: "parks",
				paint: {
					"line-color": "#16a34a",
					"line-width": 2,
				},
				layout: {
					visibility: isLayerVisible ? "visible" : "none",
				},
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
			const features = map.queryRenderedFeatures(e.point, {
				layers: ["parks-fill"],
			});
			if (features.length > 0) {
				hoveredPark = features[0].properties?.name || null;
			}
		};

		map.on("mouseenter", "parks-fill", handleMouseEnter);
		map.on("mouseleave", "parks-fill", handleMouseLeave);
		map.on("mousemove", "parks-fill", handleMouseMove);

		return () => {
			map.off("mouseenter", "parks-fill", handleMouseEnter);
			map.off("mouseleave", "parks-fill", handleMouseLeave);
			map.off("mousemove", "parks-fill", handleMouseMove);
		};
	});

	function toggleLayer() {
		const map = mapCtx?.getMap();
		if (!map) return;

		const visibility = isLayerVisible ? "none" : "visible";
		map.setLayoutProperty("parks-fill", "visibility", visibility);
		map.setLayoutProperty("parks-outline", "visibility", visibility);
		isLayerVisible = !isLayerVisible;
	}
</script>

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
