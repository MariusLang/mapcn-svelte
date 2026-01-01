<script lang="ts">
	import Map from "$lib/registry/blocks/map/Map.svelte";
	import MapMarker from "$lib/registry/blocks/map/MapMarker.svelte";
	import MarkerContent from "$lib/registry/blocks/map/MarkerContent.svelte";
	import MarkerTooltip from "$lib/registry/blocks/map/MarkerTooltip.svelte";
	import MarkerLabel from "$lib/registry/blocks/map/MarkerLabel.svelte";
	import MapControls from "$lib/registry/blocks/map/MapControls.svelte";
	import MapRoute from "$lib/registry/blocks/map/MapRoute.svelte";
	import { cn } from "$lib/utils.js";
	import Truck from "@lucide/svelte/icons/truck";
	import Flame from "@lucide/svelte/icons/flame";
	import TrendingUp from "@lucide/svelte/icons/trending-up";
	import Zap from "@lucide/svelte/icons/zap";

	// Analytics data for the world map
	const analyticsData = [
		{ lng: -74.006, lat: 40.7128, city: "New York", users: 847, size: 14 },
		{ lng: -0.1276, lat: 51.5074, city: "London", users: 623, size: 12 },
		{ lng: 139.6917, lat: 35.6895, city: "Tokyo", users: 412, size: 10 },
		{ lng: -122.4194, lat: 37.7749, city: "San Francisco", users: 298, size: 9 },
		{ lng: 2.3522, lat: 48.8566, city: "Paris", users: 187, size: 8 },
		{ lng: 77.209, lat: 28.6139, city: "Delhi", users: 156, size: 7 },
		{ lng: 151.2093, lat: -33.8688, city: "Sydney", users: 134, size: 7 },
		{ lng: -43.1729, lat: -22.9068, city: "Rio", users: 89, size: 6 },
		{ lng: 4.9041, lat: 52.3676, city: "Amsterdam", users: 76, size: 5 },
		{ lng: 126.978, lat: 37.5665, city: "Seoul", users: 45, size: 5 },
	];

	// User location state for "Locate Me" example
	let userLocation: { longitude: number; latitude: number } | null = $state(null);
</script>

<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
	<!-- Widget 1: Analytics - spans 2 cols, 2 rows -->
	<div
		class={cn(
				"relative col-span-1 h-[300px] overflow-hidden rounded-xl border border-border/50 bg-card shadow sm:col-span-2 sm:row-span-2 lg:h-[412px]"
			)}
	>
		<!-- Stats Panel -->
		<div
			class="absolute left-3 top-3 z-10 rounded-lg border border-border/50 bg-background/95 p-3 shadow-lg backdrop-blur-md"
		>
			<div class="text-muted-foreground mb-1 text-[10px] uppercase tracking-wider">
				Active Users
			</div>
			<div class="text-2xl font-bold leading-tight">2,847</div>
			<div class="mt-1 flex items-center gap-1">
				<TrendingUp class="size-3 text-emerald-500" />
				<span class="text-xs text-emerald-500">+12.5%</span>
				<span class="text-muted-foreground text-xs">vs last hour</span>
			</div>
		</div>

		<!-- Legend -->
		<div
			class="absolute bottom-3 left-3 z-10 rounded-lg border border-border/50 bg-background/95 px-3 py-2 shadow-lg backdrop-blur-md"
		>
			<div class="flex items-center gap-4 text-[10px]">
				<div class="flex items-center gap-1.5">
					<div class="size-3 rounded-full bg-emerald-500"></div>
					<span class="text-muted-foreground">High</span>
				</div>
				<div class="flex items-center gap-1.5">
					<div class="size-2 rounded-full bg-emerald-500"></div>
					<span class="text-muted-foreground">Medium</span>
				</div>
				<div class="flex items-center gap-1.5">
					<div class="size-1.5 rounded-full bg-emerald-500"></div>
					<span class="text-muted-foreground">Low</span>
				</div>
			</div>
		</div>

		<Map center={[0, 30]} zoom={0.8}>
			{#each analyticsData as loc (loc.city)}
				<MapMarker longitude={loc.lng} latitude={loc.lat}>
					<MarkerContent>
						<div class="relative flex items-center justify-center">
							<div
								class="absolute rounded-full bg-emerald-500/20"
								style="width: {loc.size * 2.5}px; height: {loc.size * 2.5}px;"
							></div>
							<div
								class="absolute animate-ping rounded-full bg-emerald-500/40"
								style="width: {loc.size * 1.5}px; height: {loc.size * 1.5}px; animation-duration: 2s;"
							></div>
							<div
								class="relative rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"
								style="width: {loc.size}px; height: {loc.size}px;"
							></div>
						</div>
					</MarkerContent>
					<MarkerTooltip>
						<div class="text-center">
							<div class="font-medium">{loc.city}</div>
							<div class="font-bold text-emerald-500">{loc.users}</div>
							<div class="text-muted-foreground text-[10px]">active users</div>
						</div>
					</MarkerTooltip>
				</MapMarker>
			{/each}
		</Map>
	</div>

	<!-- Widget 2: EV Charging -->
	<div class="relative h-[200px] overflow-hidden rounded-xl border border-border/50 bg-card shadow">
		<div
			class="absolute left-2 top-2 z-10 rounded bg-background/90 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur-sm"
		>
			EV Charging
		</div>
		<Map center={[-122.425, 37.777]} zoom={11.5}>
			<MapMarker longitude={-122.4194} latitude={37.7749}>
				<MarkerContent>
					<div class="rounded-full bg-emerald-500 p-1.5 shadow-lg shadow-emerald-500/30">
						<Zap class="size-3 fill-white text-white" />
					</div>
				</MarkerContent>
				<MarkerTooltip>
					<div class="space-y-0.5 text-xs">
						<div class="font-medium">Market St Station</div>
						<div class="flex items-center gap-1">
							<span class="size-1.5 rounded-full bg-emerald-500"></span>
							<span class="text-emerald-500">Available</span>
						</div>
						<div class="text-muted-foreground">150 kW - $0.35/kWh</div>
					</div>
				</MarkerTooltip>
			</MapMarker>

			<MapMarker longitude={-122.4094} latitude={37.7849}>
				<MarkerContent>
					<div class="rounded-full bg-emerald-500 p-1.5 shadow-lg shadow-emerald-500/30">
						<Zap class="size-3 fill-white text-white" />
					</div>
				</MarkerContent>
				<MarkerTooltip>
					<div class="space-y-0.5 text-xs">
						<div class="font-medium">Union Square</div>
						<div class="flex items-center gap-1">
							<span class="size-1.5 rounded-full bg-emerald-500"></span>
							<span class="text-emerald-500">2 Available</span>
						</div>
						<div class="text-muted-foreground">50 kW - $0.28/kWh</div>
					</div>
				</MarkerTooltip>
			</MapMarker>

			<MapMarker longitude={-122.4294} latitude={37.7689}>
				<MarkerContent>
					<div class="rounded-full bg-amber-500 p-1.5 shadow-lg shadow-amber-500/30">
						<Zap class="size-3 fill-white text-white" />
					</div>
				</MarkerContent>
				<MarkerTooltip>
					<div class="space-y-0.5 text-xs">
						<div class="font-medium">Castro Station</div>
						<div class="flex items-center gap-1">
							<span class="size-1.5 rounded-full bg-amber-500"></span>
							<span class="text-amber-500">In Use</span>
						</div>
						<div class="text-muted-foreground">~15 min remaining</div>
					</div>
				</MarkerTooltip>
			</MapMarker>

			<MapMarker longitude={-122.4394} latitude={37.7809}>
				<MarkerContent>
					<div class="rounded-full bg-zinc-400 p-1.5 shadow-lg">
						<Zap class="size-3 fill-white text-white" />
					</div>
				</MarkerContent>
				<MarkerTooltip>
					<div class="space-y-0.5 text-xs">
						<div class="font-medium">Hayes Valley</div>
						<div class="flex items-center gap-1">
							<span class="size-1.5 rounded-full bg-zinc-400"></span>
							<span class="text-muted-foreground">Offline</span>
						</div>
					</div>
				</MarkerTooltip>
			</MapMarker>
		</Map>
	</div>

	<!-- Widget 3: Locate Me -->
	<div class="relative h-[200px] overflow-hidden rounded-xl border border-border/50 bg-card shadow">
		<div
			class="absolute left-2 top-2 z-10 rounded bg-background/90 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur-sm"
		>
			Locate Me
		</div>
		<Map center={[77.5946, 12.9716]} zoom={10.5}>
			<MapControls showZoom={false} showLocate onlocate={(coords) => (userLocation = coords)} />
			{#if userLocation}
				<MapMarker longitude={userLocation.longitude} latitude={userLocation.latitude}>
					<MarkerContent>
						<div class="relative flex items-center justify-center">
							<div class="absolute size-5 animate-ping rounded-full bg-blue-500/30"></div>
							<div class="size-3 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
						</div>
					</MarkerContent>
					<MarkerTooltip>Your Location</MarkerTooltip>
				</MapMarker>
			{/if}
		</Map>
	</div>

	<!-- Widget 4: Delivery Tracking -->
	<div class="relative h-[200px] overflow-hidden rounded-xl border border-border/50 bg-card shadow">
		<div
			class="absolute left-2 top-2 z-10 rounded bg-background/90 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur-sm"
		>
			Delivery
		</div>
		<Map center={[-0.1076, 51.517]} zoom={11.2}>
			<MapRoute
				coordinates={[
						[-0.1276, 51.5074],
						[-0.12, 51.512],
						[-0.105, 51.518],
						[-0.095, 51.522],
						[-0.0876, 51.5274],
					]}
				width={4}
				color="#4285F4"
			/>
			<MapMarker longitude={-0.1276} latitude={51.5074}>
				<MarkerContent>
					<div class="relative">
						<div class="size-3.5 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
						<MarkerLabel>Store</MarkerLabel>
					</div>
				</MarkerContent>
			</MapMarker>
			<MapMarker longitude={-0.105} latitude={51.518}>
				<MarkerContent>
					<div class="rounded-full bg-blue-500 p-1.5 shadow-lg">
						<Truck class="size-3 text-white" />
					</div>
				</MarkerContent>
				<MarkerTooltip>On the way</MarkerTooltip>
			</MapMarker>
			<MapMarker longitude={-0.0876} latitude={51.5274}>
				<MarkerContent>
					<div class="relative">
						<div class="size-3.5 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
						<MarkerLabel>Home</MarkerLabel>
					</div>
				</MarkerContent>
			</MapMarker>
		</Map>
	</div>

	<!-- Widget 5: Trending Now -->
	<div class="relative h-[200px] overflow-hidden rounded-xl border border-border/50 bg-card shadow">
		<div
			class="absolute left-2 top-2 z-10 rounded bg-background/90 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur-sm"
		>
			Trending
		</div>
		<Map center={[-73.99, 40.735]} zoom={9.5}>
			<MapMarker longitude={-73.9857} latitude={40.7484}>
				<MarkerContent>
					<div class="relative flex items-center justify-center">
						<div class="absolute size-12 rounded-full bg-orange-500/30"></div>
						<div class="absolute size-7 rounded-full bg-orange-500/40"></div>
						<div
							class="rounded-full bg-gradient-to-br from-orange-500 to-red-500 p-1.5 shadow-lg shadow-orange-500/50"
						>
							<Flame class="size-3.5 text-white" />
						</div>
					</div>
				</MarkerContent>
				<MarkerTooltip>
					<div class="text-center">
						<div class="font-medium">Times Square</div>
						<div class="text-muted-foreground flex items-center justify-center gap-1">
							<TrendingUp class="size-3 text-green-500" />
							<span class="text-xs text-green-500">2.4k visitors</span>
						</div>
					</div>
				</MarkerTooltip>
			</MapMarker>
			<MapMarker longitude={-73.9654} latitude={40.7829}>
				<MarkerContent>
					<div class="relative flex items-center justify-center">
						<div class="absolute size-10 rounded-full bg-rose-500/30"></div>
						<div
							class="rounded-full bg-gradient-to-br from-rose-500 to-pink-500 p-1.5 shadow-lg shadow-rose-500/50"
						>
							<Flame class="size-3 text-white" />
						</div>
					</div>
				</MarkerContent>
				<MarkerTooltip>
					<div class="text-center">
						<div class="font-medium">Central Park</div>
						<div class="text-muted-foreground flex items-center justify-center gap-1">
							<TrendingUp class="size-3 text-green-500" />
							<span class="text-xs text-green-500">1.8k visitors</span>
						</div>
					</div>
				</MarkerTooltip>
			</MapMarker>
			<MapMarker longitude={-74.0445} latitude={40.6892}>
				<MarkerContent>
					<div class="relative flex items-center justify-center">
						<div class="absolute size-8 rounded-full bg-amber-500/30"></div>
						<div
							class="rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 p-1 shadow-lg shadow-amber-500/50"
						>
							<Flame class="size-2.5 text-white" />
						</div>
					</div>
				</MarkerContent>
				<MarkerTooltip>
					<div class="text-center">
						<div class="font-medium">Statue of Liberty</div>
						<div class="text-muted-foreground flex items-center justify-center gap-1">
							<TrendingUp class="size-3 text-green-500" />
							<span class="text-xs text-green-500">890 visitors</span>
						</div>
					</div>
				</MarkerTooltip>
			</MapMarker>
		</Map>
	</div>
</div>
