<script lang="ts">
	import Map from "$lib/registry/blocks/map/Map.svelte";
	import MapMarker from "$lib/registry/blocks/map/MapMarker.svelte";
	import MapRoute from "$lib/registry/blocks/map/MapRoute.svelte";
	import MarkerContent from "$lib/registry/blocks/map/MarkerContent.svelte";
	import MarkerTooltip from "$lib/registry/blocks/map/MarkerTooltip.svelte";
	import * as Badge from "$lib/registry/ui/badge/index.js";
	import * as Button from "$lib/registry/ui/button/index.js";
	import * as Card from "$lib/registry/ui/card/index.js";
	import Clock3 from "@lucide/svelte/icons/clock-3";
	import Utensils from "@lucide/svelte/icons/utensils";
	import Truck from "@lucide/svelte/icons/truck";
	import UserRound from "@lucide/svelte/icons/user-round";

	interface DeliveryMeal {
		name: string;
		price: string;
		quantity: number;
	}

	interface OsrmRouteData {
		coordinates: [number, number][];
		duration: number;
		distance: number;
	}

	const deliveryMeals: DeliveryMeal[] = [
		{ name: "Spicy Tofu Grain Bowl", price: "$44.00", quantity: 1 },
		{ name: "Herb Chicken Rice Box", price: "$58.00", quantity: 2 },
		{ name: "Roasted Veggie Wrap", price: "$29.00", quantity: 1 },
	];

	const pickup = { lng: -122.466, lat: 37.716 };
	const dropoff = { lng: -122.399, lat: 37.683 };

	function formatDistance(meters?: number) {
		if (!meters) return "--";
		if (meters < 1000) return `${Math.round(meters)} m`;
		return `${(meters / 1000).toFixed(1)} km`;
	}

	function formatDuration(seconds?: number) {
		if (!seconds) return "--";
		const minutes = Math.round(seconds / 60);
		if (minutes < 60) return `${minutes} min`;
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return `${hours}h ${remainingMinutes}m`;
	}

	let routeData: OsrmRouteData | null = $state(null);

	const progressCoordinates = $derived.by(() => {
		const progressCount = Math.max(
			2,
			Math.floor((routeData?.coordinates?.length ?? 0) * (routeData ? 0.62 : 0.66))
		);
		return routeData?.coordinates?.slice(0, progressCount) ?? [];
	});

	const courierPosition = $derived(progressCoordinates[progressCoordinates.length - 1]);

	$effect(() => {
		async function fetchRoute() {
			try {
				const response = await fetch(
					`https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson`
				);
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
				// route fetch complete
			}
		}
		fetchRoute();
	});
</script>

<div class="p-8">
	<div
		class="bg-sidebar mx-auto grid max-w-7xl overflow-hidden rounded-lg border md:h-[600px] md:grid-cols-[1.05fr_1fr]"
	>
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
						<p class="text-sm font-medium">{formatDuration(routeData?.duration)}</p>
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
		<div class="relative h-[400px] overflow-hidden rounded-xl shadow-sm md:h-full">
			<Map
				center={[-122.435, 37.696]}
				zoom={12}
				options={{ minZoom: 10, maxZoom: 16 }}
				styles={{
					light: "https://tiles.openfreemap.org/styles/bright",
					dark: "https://tiles.openfreemap.org/styles/dark",
				}}
			>
				<MapRoute
					id="delivery-full-route"
					coordinates={routeData?.coordinates ?? []}
					color="#5b6572"
					width={5.2}
					opacity={0.3}
					interactive={false}
				/>
				<MapRoute
					id="delivery-progress-route"
					coordinates={progressCoordinates}
					color="#3b82f6"
					width={6}
					opacity={0.95}
					interactive={false}
				/>

				{#if courierPosition}
					<MapMarker longitude={courierPosition[0]} latitude={courierPosition[1]} offset={[0, 10]}>
						<MarkerContent>
							<div
								class="relative grid size-9 place-items-center rounded-full bg-emerald-500 dark:bg-emerald-600"
							>
								<Truck class="size-4 text-white" />
							</div>
						</MarkerContent>
						<MarkerTooltip>
							<div class="space-y-0.5 text-xs">
								<p class="font-medium">
									Order {formatDuration(routeData?.duration)} away
								</p>
								<p class="text-muted-foreground">
									Route {formatDistance(routeData?.distance)}
								</p>
							</div>
						</MarkerTooltip>
					</MapMarker>
				{/if}

				<MapMarker longitude={pickup.lng} latitude={pickup.lat}>
					<MarkerContent>
						<div class="size-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm"></div>
					</MarkerContent>
					<MarkerTooltip>
						<p class="text-xs font-medium">Origin</p>
					</MarkerTooltip>
				</MapMarker>

				<MapMarker longitude={dropoff.lng} latitude={dropoff.lat}>
					<MarkerContent>
						<div class="size-4 rounded-full border-2 border-white bg-rose-500 shadow-sm"></div>
					</MarkerContent>
					<MarkerTooltip>
						<p class="text-xs font-medium">Destination</p>
					</MarkerTooltip>
				</MapMarker>
			</Map>
		</div>
	</div>
</div>
