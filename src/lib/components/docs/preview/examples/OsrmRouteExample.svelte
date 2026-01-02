<script lang="ts">
	import { onMount } from "svelte";
	import {
		Map,
		MapMarker,
		MarkerContent,
		MapRoute,
		MarkerLabel,
	} from "$lib/components/ui/map";
	import { Loader2 } from "lucide-svelte";

	const start = { name: "Times Square", lng: -73.9855, lat: 40.758 };
	const end = { name: "Central Park", lng: -73.9654, lat: 40.7829 };

	let route = $state<[number, number][] | null>(null);
	let isLoading = $state(true);

	onMount(async () => {
		try {
			const response = await fetch(
				`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`,
			);
			const data = await response.json();

			if (data?.routes?.[0]?.geometry?.coordinates) {
				route = data.routes[0].geometry.coordinates;
			}
		} catch (error) {
			console.error("Failed to fetch route:", error);
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="relative h-[400px] w-full">
	<Map center={[-73.975, 40.772]} zoom={12.5}>
		{#if route}
			<MapRoute
				coordinates={route}
				color="#6366f1"
				width={5}
				opacity={0.85}
			/>
		{/if}

		<MapMarker longitude={start.lng} latitude={start.lat}>
			<MarkerContent>
				<div
					class="size-5 rounded-full border-2 border-white bg-green-500 shadow-lg"
				/>
				<MarkerLabel position="bottom">
					Start: {start.name}
				</MarkerLabel>
			</MarkerContent>
		</MapMarker>

		<MapMarker longitude={end.lng} latitude={end.lat}>
			<MarkerContent>
				<div
					class="size-5 rounded-full border-2 border-white bg-red-500 shadow-lg"
				/>
				<MarkerLabel position="bottom">
					End: {end.name}
				</MarkerLabel>
			</MarkerContent>
		</MapMarker>
	</Map>

	{#if isLoading}
		<div class="absolute inset-0 flex items-center justify-center bg-background/50">
			<Loader2 class="size-6 animate-spin text-muted-foreground" />
		</div>
	{/if}
</div>
