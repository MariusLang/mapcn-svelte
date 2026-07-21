<script lang="ts">
	import TrendingUp from "@lucide/svelte/icons/trending-up";
	import { Map, MapGeoJSON, MapMarker, MarkerContent } from "$lib/registry/blocks/map";
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
				class="[&_.maplibregl-canvas]:cursor-default! [&_.maplibregl-canvas-container]:cursor-default!"
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
			class="from-card via-card/85 to-card/0 pointer-events-none absolute inset-x-0 top-0 z-10 h-24 rounded-t-xl bg-linear-to-b mask-[linear-gradient(to_bottom,black_70%,transparent)] backdrop-blur-[2px]"
			aria-hidden="true"
		></div>

		<div class="relative z-20 flex items-start justify-between gap-3 p-4">
			<div>
				<h2 class="text-foreground text-lg font-medium tracking-tight">Analytics</h2>
				<p class="text-muted-foreground mt-1 text-xs font-medium">Last 30 days</p>
			</div>

			<div class="text-right">
				<p class="text-foreground text-lg font-medium tracking-tight tabular-nums">
					{totalVisitors}
				</p>
				<span
					class="text-muted-foreground mt-1 inline-flex items-center gap-0.5 text-xs font-medium"
				>
					<TrendingUp class="size-2.5" />
					{visitorGrowth} visitors
				</span>
			</div>
		</div>
	</div>
</div>
