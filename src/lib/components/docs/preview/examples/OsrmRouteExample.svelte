<script lang="ts">
	import { Map, MapMarker, MarkerContent, MapRoute } from "$lib/components/ui/map";
	import { onMount } from "svelte";
	import { cn } from "$lib/utils";
	const routeColor = "#3b82f6";
	const inactiveOpacity = 0.35;

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
	onMount(() => {
		void fetchRoutes();
	});
</script>

<div class="relative h-125 w-full">
	<Map center={[4.69, 52.14]} zoom={8.5} loading={isLoading}>
		{#each routesWithIndex as { route, index } (index)}
			{@const isSelected = index === selectedIndex}
			<MapRoute
				id={`route-${index}`}
				coordinates={route.coordinates}
				active={isSelected}
				color={routeColor}
				width={5}
				opacity={inactiveOpacity}
				activeWidth={6}
				activeOpacity={1}
				onclick={() => (selectedIndex = index)}
			/>
		{/each}

		<MapMarker longitude={start.lng} latitude={start.lat}>
			<MarkerContent>
				<div class="border-foreground bg-background size-3.5 rounded-full border-2 shadow-md"></div>
			</MarkerContent>
		</MapMarker>

		<MapMarker longitude={end.lng} latitude={end.lat}>
			<MarkerContent>
				<div class="bg-foreground ring-background size-3.5 rounded-full shadow-md ring-2"></div>
			</MarkerContent>
		</MapMarker>
	</Map>

	{#if routes.length > 0}
		<div
			role="radiogroup"
			aria-label="Route options"
			class="bg-background/95 border-border/50 absolute top-3 left-3 w-48 space-y-0.5 rounded-lg border p-1 shadow-lg backdrop-blur-md"
		>
			{#each routes as route, index}
				{@const isActive = index === selectedIndex}
				<button
					type="button"
					role="radio"
					aria-checked={isActive}
					onclick={() => (selectedIndex = index)}
					class={cn(
						"flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors",
						isActive ? "bg-muted" : "hover:bg-muted/50"
					)}
				>
					<span
						class="h-4 w-0.5 shrink-0 rounded-full"
						style:background-color={routeColor}
						style:opacity={isActive ? 1 : inactiveOpacity}
					></span>
					<span class={cn("text-sm font-medium tabular-nums", !isActive && "text-muted-foreground")}
						>{formatDuration(route.duration)}</span
					>
					<span class="text-muted-foreground ml-auto text-xs tabular-nums"
						>{formatDistance(route.distance)}</span
					>
				</button>
			{/each}
		</div>
	{/if}
</div>
