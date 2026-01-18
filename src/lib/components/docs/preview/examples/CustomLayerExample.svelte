<script lang="ts">
	import { Map, MapControls } from "$lib/components/ui/map";
	import CustomLayerContent from "./CustomLayerContent.svelte";

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
</script>

<div class="h-[400px] w-full">
	<Map center={[-73.97, 40.78]} zoom={11.8}>
		<MapControls />
		<CustomLayerContent {geojsonData} />
	</Map>
</div>
