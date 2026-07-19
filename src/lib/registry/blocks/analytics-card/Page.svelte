<script lang="ts">
	import TrendingUp from "@lucide/svelte/icons/trending-up";
	import { Map, MapGeoJSON, MapMarker, MarkerContent } from "$lib/registry/blocks/map";
	import { Button } from "$lib/registry/ui/button/index";
	import { totalVisitors, visitorGrowth, visitorLocations } from "./data.js";

	const WORLD_GEOJSON =
		"https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";

	function bubbleSize(visitors: number) {
		return Math.round(10 + Math.sqrt(visitors) * 2.2);
	}
</script>

<div class="flex min-h-screen items-center justify-center p-8">
	<div
		class="bg-card relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-xl border shadow-sm"
	>
		<div class="absolute inset-0">
			<Map
				center={[1, 30]}
				options={{
					scrollZoom: false,
					dragRotate: false,
					dragPan: false,
					doubleClickZoom: false,
					pitchWithRotate: false,
				}}
				blank
			>
				<MapGeoJSON data={WORLD_GEOJSON} linePaint={false} />
				{#each visitorLocations as location (location.city)}
					<MapMarker longitude={location.lng} latitude={location.lat}>
						<MarkerContent class="cursor-default">
							<span
								class="bg-chart-2/80 block rounded-full"
								style:width={`${bubbleSize(location.visitors)}px`}
								style:height={`${bubbleSize(location.visitors)}px`}
							></span>
						</MarkerContent>
					</MapMarker>
				{/each}
			</Map>
		</div>

		<div
			class="from-card to-card/0 pointer-events-none absolute inset-x-0 top-0 z-10 h-24 rounded-t-xl bg-linear-to-b [mask-image:linear-gradient(to_bottom,black_55%,transparent)] backdrop-blur-[2px]"
			aria-hidden="true"
		></div>

		<div class="relative z-20 flex items-start justify-between gap-3 p-4">
			<div>
				<h2 class="text-foreground text-lg font-medium tracking-tight">Analytics</h2>
				<div class="mt-1.5 flex items-center gap-2">
					<p class="text-muted-foreground text-xs font-medium">
						<span class="tabular-nums">{totalVisitors}</span> visitors
					</p>
					<span class="inline-flex items-center gap-0.5 text-xs font-medium">
						<TrendingUp class="size-2.5" />
						{visitorGrowth}
					</span>
				</div>
			</div>

			<Button variant="outline" size="xs" class="h-7 px-2.5">View Analytics</Button>
		</div>
	</div>
</div>
