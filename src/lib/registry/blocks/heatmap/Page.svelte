<script lang="ts">
	import Map from "$lib/registry/blocks/map/Map.svelte";
	import GlobeHeatmapLayers from "./GlobeHeatmapLayers.svelte";

	const HEATMAP_GRADIENT_COLORS = ["#fff7bc", "#fee391", "#fec44f", "#fe9929", "#d7301f"];
	const gradient = `linear-gradient(to right, ${HEATMAP_GRADIENT_COLORS.join(", ")})`;
</script>

<div class="bg-card relative h-screen">
	<div class="relative h-full">
		<Map
			center={[-113, 43]}
			zoom={3.2}
			projection={{ type: "globe" }}
			options={{ pitch: 24, minZoom: 1.2, maxZoom: 8 }}
		>
			<GlobeHeatmapLayers />
		</Map>
	</div>

	<div class="bg-card/90 absolute top-4 left-4 z-10 rounded-lg border px-3 py-2.5 backdrop-blur-sm">
		<p class="text-foreground text-sm font-medium">Global Earthquakes Heatmap</p>
		<div class="mt-3 h-2 w-full rounded-full" style:background-image={gradient}></div>
		<div class="text-muted-foreground flex items-center justify-between pt-1.5 text-[10px]">
			<span>Low</span>
			<span>High</span>
		</div>
	</div>
</div>
