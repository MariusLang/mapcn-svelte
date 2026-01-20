<script lang="ts">
	import { Map, MapMarker, MarkerContent, MapRoute, MarkerLabel } from "$lib/components/ui/map";
	import { Loader2, Clock, Route } from "lucide-svelte";
	import { Button } from "$lib/registry/ui/button/index";

	const start = { name: "Amsterdam", lng: 4.9041, lat: 52.3676 };
	const end = { name: "Rotterdam", lng: 4.4777, lat: 51.9244 };

	interface RouteData {
		coordinates: [number, number][];
		duration: number; // seconds
		distance: number; // meters
	}

	let routes = $state<RouteData[]>([]);
	let selectedIndex = $state(0);
	let isLoading = $state(true);

	function formatDuration(seconds: number): string {
		const mins = Math.round(seconds / 60);
		if (mins < 60) return `${mins} min`;
		const hours = Math.floor(mins / 60);
		const remainingMins = mins % 60;
		return `${hours}h ${remainingMins}m`;
	}

	function formatDistance(meters: number): string {
		if (meters < 1000) return `${Math.round(meters)} m`;
		return `${(meters / 1000).toFixed(1)} km`;
	}

	async function fetchRoutes() {
		try {
			const response = await fetch(
				`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&alternatives=true`
			);
			const data = await response.json();

			if (data.routes?.length > 0) {
				const routeData: RouteData[] = data.routes.map(
					(route: {
						geometry: { coordinates: [number, number][] };
						duration: number;
						distance: number;
					}) => ({
						coordinates: route.geometry.coordinates,
						duration: route.duration,
						distance: route.distance,
					})
				);
				routes = routeData;
			}
		} catch (error) {
			console.error("Failed to fetch routes:", error);
		} finally {
			isLoading = false;
		}
	}

	// Map routes with their indices for rendering
	const routesWithIndex = $derived(routes.map((route, index) => ({ route, index })));

	// Fetch routes on mount
	fetchRoutes();
</script>

<div class="relative h-125 w-full">
	<Map center={[4.69, 52.14]} zoom={8.5}>
		{#each routesWithIndex as { route, index } (index)}
			{@const isSelected = index === selectedIndex}
			<MapRoute
				id={`route-${index}`}
				coordinates={route.coordinates}
				color={isSelected ? "#6366f1" : "#94a3b8"}
				width={isSelected ? 6 : 5}
				opacity={isSelected ? 1 : 0.6}
				onclick={() => (selectedIndex = index)}
			/>
		{/each}

		<MapMarker longitude={start.lng} latitude={start.lat}>
			<MarkerContent>
				<div class="size-5 rounded-full border-2 border-white bg-green-500 shadow-lg"></div>
				<MarkerLabel position="top">{start.name}</MarkerLabel>
			</MarkerContent>
		</MapMarker>

		<MapMarker longitude={end.lng} latitude={end.lat}>
			<MarkerContent>
				<div class="size-5 rounded-full border-2 border-white bg-red-500 shadow-lg"></div>
				<MarkerLabel position="bottom">{end.name}</MarkerLabel>
			</MarkerContent>
		</MapMarker>
	</Map>

	{#if routes.length > 0}
		<div class="absolute top-3 left-3 flex flex-col gap-2">
			{#each routes as route, index}
				{@const isActive = index === selectedIndex}
				{@const isFastest = index === 0}
				<Button
					variant={isActive ? "default" : "secondary"}
					size="sm"
					onclick={() => (selectedIndex = index)}
					class="justify-start gap-3"
				>
					<div class="flex items-center gap-1.5">
						<Clock class="size-3.5" />
						<span class="font-medium">{formatDuration(route.duration)}</span>
					</div>
					<div class="flex items-center gap-1.5 text-xs opacity-80">
						<Route class="size-3" />
						{formatDistance(route.distance)}
					</div>
					{#if isFastest}
						<span
							class="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900 dark:text-green-300"
						>
							Fastest
						</span>
					{/if}
				</Button>
			{/each}
		</div>
	{/if}

	{#if isLoading}
		<div class="bg-background/50 absolute inset-0 flex items-center justify-center">
			<Loader2 class="text-muted-foreground size-6 animate-spin" />
		</div>
	{/if}
</div>
