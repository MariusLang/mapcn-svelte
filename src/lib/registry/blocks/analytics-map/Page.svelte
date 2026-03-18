<script lang="ts">
	import Map from "$lib/registry/blocks/map/Map.svelte";
	import MapControls from "$lib/registry/blocks/map/MapControls.svelte";
	import MapMarker from "$lib/registry/blocks/map/MapMarker.svelte";
	import MarkerContent from "$lib/registry/blocks/map/MarkerContent.svelte";
	import MarkerTooltip from "$lib/registry/blocks/map/MarkerTooltip.svelte";
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
</script>

<div class="bg-background relative min-h-screen" style="--map-height: {MAP_HEIGHT}">
	<div class="relative" style="height: var(--map-height)">
		<Map center={[-2, 16]} zoom={1.5} options={{ scrollZoom: false, renderWorldCopies: true }}>
			<MapControls showFullscreen />
			{#each locations as location (location.city)}
				<MapMarker longitude={location.lng} latitude={location.lat}>
					<MarkerContent>
						<div
							class="rounded-full bg-blue-500/70"
							style="width: {location.size * 3}px; height: {location.size * 3}px"
						></div>
					</MarkerContent>
					<MarkerTooltip offset={20} class="bg-background text-foreground border">
						<p class="text-muted-foreground font-medium">{location.city}</p>
						<p class="mt-0.5">{location.size} active users</p>
					</MarkerTooltip>
				</MapMarker>
			{/each}
		</Map>
		<div
			class="via-background/30 to-background pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent"
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
