<script lang="ts">
	import type * as MapLibreGL from "maplibre-gl";
	import { Map, MapMarker, MarkerContent } from "$lib/components/ui/map";
	import { Button } from "$lib/registry/ui/button/index";
	import ExampleCard from "$lib/components/home/ExampleCard.svelte";

	const destinations = [
		{ name: "New York", center: [-74.006, 40.7128] as [number, number] },
		{ name: "London", center: [-0.1276, 51.5074] as [number, number] },
		{ name: "Tokyo", center: [139.6917, 35.6895] as [number, number] },
		{ name: "Sydney", center: [151.2093, -33.8688] as [number, number] },
	];

	let map: MapLibreGL.Map | null = $state(null);
	let activeIndex = $state(0);
	const active = $derived(destinations[activeIndex]);

	function flyTo(index: number) {
		activeIndex = index;
		map?.flyTo({
			center: destinations[index].center,
			zoom: 6,
			duration: 2000,
			essential: true,
		});
	}
</script>

<ExampleCard class="aspect-square" stagger={8}>
	<Map
		bind:map
		center={active.center}
		zoom={5.5}
		options={{ scrollZoom: false, dragRotate: false, pitchWithRotate: false }}
	>
		<MapMarker longitude={active.center[0]} latitude={active.center[1]}>
			<MarkerContent>
				<div class="flex items-center justify-center">
					<div class="size-3.5 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
				</div>
			</MarkerContent>
		</MapMarker>
	</Map>

	<div class="absolute inset-x-3 top-3 flex flex-wrap gap-1.5">
		{#each destinations as destination, index (destination.name)}
			<Button
				size="xs"
				variant={index === activeIndex ? "default" : "secondary"}
				onclick={() => flyTo(index)}
				class="rounded-full border"
			>
				{destination.name}
			</Button>
		{/each}
	</div>
</ExampleCard>
