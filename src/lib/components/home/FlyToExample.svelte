<script lang="ts">
	import { Map, MapMarker, MarkerContent, MarkerTooltip } from "$lib/components/ui/map";

	import ExampleCard from "$lib/components/home/ExampleCard.svelte";
	import FlyToControls from "$lib/components/home/FlyToControls.svelte";

	const destination = {
		name: "New York",
		description: "United States",
		center: [-74.006, 40.7128] as [number, number],
		startCenter: [10, 50] as [number, number],
	};
</script>

<ExampleCard class="aspect-square" stagger={6}>
	<Map
		center={destination.startCenter}
		zoom={5.5}
		projection={{ type: "globe" }}
		options={{ scrollZoom: false, dragRotate: false, pitchWithRotate: false }}
	>
		<FlyToControls {destination} />

		<MapMarker longitude={destination.center[0]} latitude={destination.center[1]}>
			<MarkerContent>
				<div class="flex items-center justify-center">
					<div class="size-3.5 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
				</div>
			</MarkerContent>
			<MarkerTooltip>
				<div class="text-center">
					<div class="font-medium">{destination.name}</div>
					<div class="text-background/70 text-[10px]">
						{destination.description}
					</div>
				</div>
			</MarkerTooltip>
		</MapMarker>
	</Map>
</ExampleCard>
