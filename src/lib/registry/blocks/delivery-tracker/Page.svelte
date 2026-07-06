<script lang="ts">
	import Map from "$lib/registry/blocks/map/Map.svelte";
	import MapMarker from "$lib/registry/blocks/map/MapMarker.svelte";
	import MapRoute from "$lib/registry/blocks/map/MapRoute.svelte";
	import MarkerContent from "$lib/registry/blocks/map/MarkerContent.svelte";
	import * as Badge from "$lib/registry/ui/badge/index.js";
	import * as Button from "$lib/registry/ui/button/index.js";
	import * as Card from "$lib/registry/ui/card/index.js";
	import Clock3 from "@lucide/svelte/icons/clock-3";
	import House from "@lucide/svelte/icons/house";
	import Store from "@lucide/svelte/icons/store";
	import Utensils from "@lucide/svelte/icons/utensils";
	import Truck from "@lucide/svelte/icons/truck";
	import UserRound from "@lucide/svelte/icons/user-round";
	import { theme } from "$lib/theme";
	import {
		buildRouteUrl,
		deliveryMeals,
		dropoff,
		mapView,
		pickup,
		progressFraction,
		routeStyle,
		type OsrmRouteData,
	} from "./data";

	function formatDistance(meters: number | undefined) {
		if (!meters) return "--";
		if (meters < 1000) return `${Math.round(meters)} m`;
		return `${(meters / 1000).toFixed(1)} km`;
	}

	function formatDuration(seconds: number | undefined) {
		if (!seconds) return "--";
		const minutes = Math.round(seconds / 60);
		if (minutes < 60) return `${minutes} min`;
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return `${hours}h ${remainingMinutes}m`;
	}

	let routeData: OsrmRouteData | null = $state(null);
	let loading = $state(true);
	let currentTheme = $state<"light" | "dark">("light");
	const remainingRouteColor = $derived(
		currentTheme === "dark" ? routeStyle.remaining.color.dark : routeStyle.remaining.color.light
	);

	const progressCoordinates = $derived.by(() => {
		const total = routeData?.coordinates?.length ?? 0;
		const progressCount = Math.max(2, Math.floor(total * progressFraction));
		return routeData?.coordinates?.slice(0, progressCount) ?? [];
	});

	const courierPosition = $derived(progressCoordinates[progressCoordinates.length - 1]);

	$effect(() => {
		const unsubscribe = theme.subscribe((value) => {
			currentTheme = value;
		});
		return unsubscribe;
	});

	$effect(() => {
		async function fetchRoute() {
			loading = true;
			try {
				const response = await fetch(buildRouteUrl(pickup, dropoff));
				const data = await response.json();
				const route = data?.routes?.[0];
				if (!route?.geometry?.coordinates) return;

				routeData = {
					coordinates: route.geometry.coordinates as [number, number][],
					duration: route.duration as number,
					distance: route.distance as number,
				};
			} catch (error) {
				console.error("Failed to fetch route:", error);
			} finally {
				loading = false;
			}
		}
		fetchRoute();
	});
</script>

<div class="flex min-h-screen items-center justify-center p-8">
	<div class="bg-sidebar mx-auto grid w-[1200px] rounded-xl border md:grid-cols-[1.05fr_1fr]">
		<!-- Left panel -->
		<div class="flex flex-col p-5 md:p-6">
			<div class="space-y-1">
				<h3 class="text-2xl font-semibold tracking-tight">Track Delivery</h3>
				<p class="text-muted-foreground text-sm">Mon Feb 10 - 2-3 PM</p>
			</div>

			<Card.Root class="mt-5">
				<Card.Header>
					<Card.Title class="font-medium">
						Order items ({deliveryMeals.length})
					</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-5">
					{#each deliveryMeals as meal (meal.name)}
						<div class="flex items-center gap-3">
							<div class="bg-muted grid size-8 place-items-center rounded-full text-xs font-medium">
								<Utensils class="text-muted-foreground size-4" />
							</div>
							<div class="min-w-4 flex-1">
								<p class="truncate pb-1 text-sm font-medium">{meal.name}</p>
								<p class="text-muted-foreground text-xs">{meal.price}</p>
							</div>
							<Badge.Badge variant="secondary" class="h-6 rounded-full px-2.5">
								x{meal.quantity}
							</Badge.Badge>
						</div>
					{/each}
					<div class="border-border/60 flex items-center justify-between border-t pt-3 text-sm">
						<span class="text-muted-foreground">Bundle total</span>
						<span class="font-medium">$189.00</span>
					</div>
				</Card.Content>
			</Card.Root>

			<div class="mt-4 grid gap-3 sm:grid-cols-2">
				<Card.Root>
					<Card.Content class="space-y-2">
						<p class="text-muted-foreground text-sm font-medium">Pickup confirmed</p>
						<p class="text-sm font-medium">Mon, Feb 10 at 1:48 PM</p>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Content class="space-y-2">
						<p class="text-muted-foreground text-sm font-medium">Remaining travel</p>
						<p class="text-sm font-medium">
							{formatDuration(routeData?.duration)}
							<span class="text-muted-foreground font-normal">
								·
								{formatDistance(routeData?.distance)}
							</span>
						</p>
					</Card.Content>
				</Card.Root>
			</div>

			<div class="mt-6 flex flex-wrap items-center gap-2">
				<Button.Button size="sm" class="gap-1.5">
					<Clock3 class="size-4" />
					View timeline
				</Button.Button>
				<Button.Button variant="outline" size="sm" class="gap-1.5">
					<UserRound class="size-4" />
					Contact courier
				</Button.Button>
			</div>
		</div>

		<!-- Map panel -->
		<div class="relative h-[450px] overflow-hidden rounded-xl shadow-sm md:h-full">
			<Map
				{loading}
				center={mapView.center}
				zoom={mapView.zoom}
				options={{ minZoom: mapView.minZoom, maxZoom: mapView.maxZoom }}
			>
				<MapRoute
					id="delivery-full-route"
					coordinates={routeData?.coordinates ?? []}
					color={remainingRouteColor}
					width={routeStyle.remaining.width}
					opacity={routeStyle.remaining.opacity}
					interactive={false}
				/>
				<MapRoute
					id="delivery-progress-route"
					coordinates={progressCoordinates}
					color={routeStyle.progress.color}
					width={routeStyle.progress.width}
					opacity={routeStyle.progress.opacity}
					interactive={false}
				/>

				{#if courierPosition}
					<MapMarker longitude={courierPosition[0]} latitude={courierPosition[1]} offset={[0, 10]}>
						<MarkerContent>
							<div
								class="relative grid size-9 place-items-center rounded-full shadow-md"
								style:background-color={routeStyle.progress.color}
							>
								<Truck class="size-4 text-white" />
								<div
									class="bg-popover text-popover-foreground absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 rounded-md border px-2 py-1 text-xs font-medium whitespace-nowrap shadow-md"
								>
									{formatDuration(routeData?.duration)} away
									<span
										class="bg-popover absolute top-full left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b"
									></span>
								</div>
							</div>
						</MarkerContent>
					</MapMarker>
				{/if}

				<MapMarker longitude={pickup.lng} latitude={pickup.lat}>
					<MarkerContent>
						<div class="grid size-7 place-items-center rounded-full bg-emerald-500 shadow-md">
							<Store class="size-3.5 text-white" />
						</div>
					</MarkerContent>
				</MapMarker>

				<MapMarker longitude={dropoff.lng} latitude={dropoff.lat}>
					<MarkerContent>
						<div class="grid size-7 place-items-center rounded-full bg-rose-500 shadow-md">
							<House class="size-3.5 text-white" />
						</div>
					</MarkerContent>
				</MapMarker>
			</Map>
		</div>
	</div>
</div>
