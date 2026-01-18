<script lang="ts">
	import { onMount } from "svelte";
	import {
		Map,
		MapMarker,
		MarkerContent,
		MarkerLabel,
		MarkerTooltip,
		MapRoute,
	} from "$lib/components/ui/map";
	import Truck from "@lucide/svelte/icons/truck";
	import ExampleCard from "$lib/components/home/ExampleCard.svelte";

	const store = { lng: -0.14, lat: 51.5154 };
	const home = { lng: -0.07, lat: 51.51 };

	let route: [number, number][] = $state([]);
	let truckPosition: [number, number] | null = $state(null);

	onMount(async () => {
		try {
			const response = await fetch(
				`https://router.project-osrm.org/route/v1/driving/${store.lng},${store.lat};${home.lng},${home.lat}?overview=full&geometries=geojson`
			);
			const data = await response.json();

			if (data.routes?.[0]?.geometry?.coordinates) {
				const coords: [number, number][] = data.routes[0].geometry.coordinates;
				route = coords;
				const truckIdx = Math.floor(coords.length * 0.6);
				truckPosition = coords[truckIdx];
			}
		} catch (error) {
			console.error("Failed to fetch route:", error);
		}
	});
</script>

<ExampleCard
	label="Delivery"
	class="aspect-square sm:col-span-2 sm:aspect-video lg:aspect-auto"
	delay="delay-900"
>
	<Map center={[-0.105, 51.511]} zoom={12.4}>
		{#if route.length > 0}
			<MapRoute coordinates={route} width={4} color="#4285F4" />
		{/if}

		<MapMarker longitude={store.lng} latitude={store.lat}>
			<MarkerContent>
				<div class="size-3.5 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
				<MarkerLabel>Store</MarkerLabel>
			</MarkerContent>
		</MapMarker>

		{#if truckPosition}
			<MapMarker longitude={truckPosition[0]} latitude={truckPosition[1]}>
				<MarkerContent>
					<div class="rounded-full bg-blue-500 p-1.5 shadow-lg">
						<Truck class="size-3 text-white" />
					</div>
				</MarkerContent>
				<MarkerTooltip>On the way</MarkerTooltip>
			</MapMarker>
		{/if}

		<MapMarker longitude={home.lng} latitude={home.lat}>
			<MarkerContent>
				<div class="size-3.5 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
				<MarkerLabel>Home</MarkerLabel>
			</MarkerContent>
		</MapMarker>
	</Map>
</ExampleCard>
