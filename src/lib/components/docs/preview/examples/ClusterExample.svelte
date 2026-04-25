<script lang="ts">
	import { Map } from "$lib/components/ui/map";
	import MapControls from "$lib/registry/blocks/map/MapControls.svelte";
	import MapClusterLayer from "$lib/registry/blocks/map/MapClusterLayer.svelte";
	import MapPopup from "$lib/registry/blocks/map/MapPopup.svelte";

	interface EarthquakeProperties {
		mag: number;
		place: string;
		tsunami: number;
	}

	let selectedPoint: {
		coordinates: [number, number];
		properties: EarthquakeProperties;
	} | null = $state(null);
</script>

<div class="h-[420px] w-full">
	<Map center={[-103.59, 40.66]} zoom={3.4}>
		<MapClusterLayer
			data="https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson"
			clusterRadius={50}
			clusterMaxZoom={14}
			clusterColors={["#1d8cf8", "#6d5dfc", "#e23670"]}
			pointColor="#3b82f6"
			onpointclick={(feature, coordinates) => {
				if (feature.properties) {
					selectedPoint = {
						coordinates,
						properties: feature.properties as EarthquakeProperties,
					};
				}
			}}
		/>

		{#if selectedPoint}
			<MapPopup
				longitude={selectedPoint.coordinates[0]}
				latitude={selectedPoint.coordinates[1]}
				onclose={() => (selectedPoint = null)}
				closeOnClick={false}
				focusAfterOpen={false}
				closeButton
				class="w-34"
			>
				<div class="text-[13px]">
					<p class="text-muted-foreground">
						Magnitude:
						<span class="text-foreground font-medium">
							{selectedPoint.properties.mag}
						</span>
					</p>
					<p class="text-muted-foreground">
						Tsunami:
						<span class="text-foreground font-medium">
							{selectedPoint.properties.tsunami === 1 ? "Yes" : "No"}
						</span>
					</p>
				</div>
			</MapPopup>
		{/if}

		<MapControls position="bottom-right" showZoom />
	</Map>
</div>
