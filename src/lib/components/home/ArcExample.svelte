<script lang="ts">
	import { Map, MapArc, MapMarker, MarkerContent, MarkerTooltip } from "$lib/components/ui/map";
	import RadioTower from "@lucide/svelte/icons/radio-tower";
	import ExampleCard from "$lib/components/home/ExampleCard.svelte";

	const arcs = [
		{
			id: "ny-london",
			from: [-74.006, 40.7128] as [number, number],
			to: [-0.1276, 51.5074] as [number, number],
		},
		{
			id: "ny-paris",
			from: [-74.006, 40.7128] as [number, number],
			to: [2.3522, 48.8566] as [number, number],
		},
		{
			id: "ny-berlin",
			from: [-74.006, 40.7128] as [number, number],
			to: [13.405, 52.52] as [number, number],
		},
	];

	const hubs = [
		{ name: "New York", lng: -74.006, lat: 40.7128 },
		{ name: "London", lng: -0.1276, lat: 51.5074 },
		{ name: "Paris", lng: 2.3522, lat: 48.8566 },
		{ name: "Berlin", lng: 13.405, lat: 52.52 },
	];
</script>

<ExampleCard class="aspect-square" stagger={7}>
	<div
		class="bg-background/95 border-border/50 absolute top-3 left-3 z-10 rounded-lg border p-3 shadow-lg backdrop-blur-md"
	>
		<div class="flex items-center gap-1.5">
			<RadioTower class="size-3.5 text-blue-500" />
			<span class="text-xs font-medium">Network arcs</span>
		</div>
	</div>

	<Map center={[-28, 48]} zoom={1.8} options={{ renderWorldCopies: false }}>
		<MapArc
			data={arcs}
			curvature={0.18}
			paint={{ "line-color": "#3b82f6", "line-width": 2, "line-opacity": 0.75 }}
			hoverPaint={{ "line-color": "#60a5fa", "line-width": 3 }}
		/>

		{#each hubs as hub (hub.name)}
			<MapMarker longitude={hub.lng} latitude={hub.lat}>
				<MarkerContent>
					<div class="size-2.5 rounded-full border border-white bg-blue-500 shadow-sm"></div>
				</MarkerContent>
				<MarkerTooltip>{hub.name}</MarkerTooltip>
			</MapMarker>
		{/each}
	</Map>
</ExampleCard>
