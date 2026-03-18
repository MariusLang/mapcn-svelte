<script lang="ts">
	import Map from "$lib/registry/blocks/map/Map.svelte";
	import * as Card from "$lib/registry/ui/card/index.js";
	import GlobeHeatmapLayers from "./GlobeHeatmapLayers.svelte";

	const EARTHQUAKE_GEOJSON_URL =
		"https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson";

	const HEATMAP_GRADIENT_COLORS = [
		"#fff7bc",
		"#fee391",
		"#fec44f",
		"#fe9929",
		"#d7301f",
	];
</script>

<div class="bg-muted/50 relative h-screen">
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

	<Card.Root class="absolute top-4 left-4 z-10 w-72">
		<Card.Header>
			<Card.Title>Global Earthquakes Heatmap</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="grid grid-cols-5 gap-1.5">
				{#each HEATMAP_GRADIENT_COLORS as color}
					<span class="h-2.5 rounded-full" style="background-color: {color}"></span>
				{/each}
			</div>
			<div class="text-muted-foreground flex items-center justify-between pt-3 text-xs">
				<span>Low</span>
				<span>High</span>
			</div>
			<p class="text-muted-foreground pt-2 text-xs">
				Data source:
				<a
					href={EARTHQUAKE_GEOJSON_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-foreground underline underline-offset-4 transition-colors"
				>
					MapLibre earthquakes.geojson
				</a>
			</p>
		</Card.Content>
	</Card.Root>
</div>
