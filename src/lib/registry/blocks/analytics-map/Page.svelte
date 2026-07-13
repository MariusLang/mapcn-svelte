<script lang="ts">
	import {
		Map,
		MapControls,
		MapGeoJSON,
		MapMarker,
		MarkerContent,
		MarkerTooltip,
	} from "$lib/components/ui/map";
	import OverviewCard from "./OverviewCard.svelte";
	import BreakdownCard from "./BreakdownCard.svelte";
	import {
		locations,
		visitedPagesRows,
		countriesRows,
		referrersRows,
		browsersRows,
	} from "./data.js";

	const MAP_HEIGHT = "38rem";
	const WORLD_GEOJSON =
		"https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";
</script>

<div class="bg-background relative min-h-screen" style="--map-height: {MAP_HEIGHT}">
	<div class="bg-card relative" style="height: var(--map-height)">
		<Map
			center={[-2, 16]}
			zoom={1.4}
			options={{
				scrollZoom: false,
				dragRotate: false,
				pitchWithRotate: false,
				renderWorldCopies: true,
				maxZoom: 4,
				minZoom: 1.4,
			}}
			blank
		>
			<MapGeoJSON data={WORLD_GEOJSON} linePaint={false} />
			<MapControls class="bottom-2" />
			{#each locations as location (location.city)}
				<MapMarker longitude={location.lng} latitude={location.lat}>
					<MarkerContent class="group">
						<div
							class="bg-chart-2/80 group-hover:bg-chart-2/90 rounded-full transition-[transform,background-color] group-hover:scale-110"
							style="width: {location.size * 3}px; height: {location.size * 3}px"
						></div>
					</MarkerContent>
					<MarkerTooltip offset={20} class="bg-popover text-popover-foreground border">
						<p class="font-medium">{location.city}</p>
						<p class="text-muted-foreground mt-0.5">{location.size} active users</p>
					</MarkerTooltip>
				</MapMarker>
			{/each}
		</Map>
		<div
			class="via-background/30 to-background pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent"
			aria-hidden="true"
		></div>
		<OverviewCard />
	</div>

	<div class="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		<BreakdownCard title="Visited pages" rows={visitedPagesRows} />
		<BreakdownCard title="Referrers" rows={referrersRows} />
		<BreakdownCard title="Countries" rows={countriesRows} />
		<BreakdownCard title="Browsers" rows={browsersRows} />
	</div>
</div>
