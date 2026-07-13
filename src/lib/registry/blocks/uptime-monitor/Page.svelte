<script lang="ts">
	import { Map, MapControls, MapGeoJSON } from "$lib/registry/blocks/map";
	import EdgeNodeMarker from "./EdgeNodeMarker.svelte";
	import StatusSidebar from "./StatusSidebar.svelte";
	import { edgeNodes, mapView, WORLD_GEOJSON } from "./data";
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="bg-card flex h-[500px] w-full max-w-4xl overflow-hidden rounded-xl border shadow-sm">
		<StatusSidebar nodes={edgeNodes} />

		<div class="relative min-w-0 flex-1">
			<Map
				blank
				center={mapView.center}
				zoom={mapView.zoom}
				options={{
					minZoom: mapView.minZoom,
					maxZoom: mapView.maxZoom,
					scrollZoom: false,
					dragRotate: false,
					pitchWithRotate: false,
				}}
			>
				<MapGeoJSON data={WORLD_GEOJSON} linePaint={false} />
				{#each edgeNodes as node (node.id)}
					<EdgeNodeMarker {node} />
				{/each}
				<MapControls class="bottom-2" />
			</Map>
		</div>
	</div>
</div>
