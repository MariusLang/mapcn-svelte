<script lang="ts">
	import { Map, MapMarker, MarkerContent, MarkerTooltip } from "$lib/components/ui/map";
	import TrendingUp from "@lucide/svelte/icons/trending-up";
	import ExampleCard from "$lib/components/home/ExampleCard.svelte";

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
</script>

<ExampleCard
	label=""
	class="aspect-square sm:col-span-2 sm:aspect-video lg:aspect-auto"
	delay="delay-400"
>
	<!-- Stats Panel -->
	<div
		class="border-border/50 bg-background/95 absolute top-3 left-3 z-10 rounded-lg border p-3 shadow-lg backdrop-blur-md"
	>
		<div class="text-muted-foreground mb-1 text-[10px] tracking-wider uppercase">Active Users</div>
		<div class="text-2xl leading-tight font-bold">2,847</div>
		<div class="mt-1 flex items-center gap-1">
			<TrendingUp class="size-3 text-emerald-500" />
			<span class="text-xs text-emerald-500">+12.5%</span>
			<span class="text-muted-foreground text-xs">vs last hour</span>
		</div>
	</div>

	<!-- Legend -->
	<div
		class="border-border/50 bg-background/95 absolute bottom-3 left-3 z-10 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-md"
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

	<Map center={[0, 30]}>
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
</ExampleCard>
