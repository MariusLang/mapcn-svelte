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

<ExampleCard label="Fly To" class="aspect-square" delay="delay-600">
	<Map center={destination.startCenter} zoom={0.5} projection={{ type: "globe" }}>
		<FlyToControls {destination} />

		<MapMarker longitude={destination.center[0]} latitude={destination.center[1]}>
			<MarkerContent>
				<div class="relative flex items-center justify-center">
					<div class="absolute size-6 animate-ping rounded-full bg-cyan-500/20"></div>
					<div class="shadow-l size-4 rounded-full border-2 border-white bg-cyan-500"></div>
				</div>
			</MarkerContent>
			<MarkerTooltip>
				<div class="text-center">
					<div class="font-medium">{destination.name}</div>
					<div class="text-muted-foreground text-[10px]">
						{destination.description}
					</div>
				</div>
			</MarkerTooltip>
		</MapMarker>
	</Map>
</ExampleCard>
