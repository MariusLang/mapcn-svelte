<script lang="ts">
	import TrendingUp from "@lucide/svelte/icons/trending-up";
	import { Map, MapGeoJSON, MapMarker, MarkerContent } from "$lib/registry/blocks/map";
	import { Badge } from "$lib/registry/ui/badge";
	import * as Card from "$lib/registry/ui/card";
	import { totalVisitors, visitorGrowth, visitorLocations } from "./data.js";

	const WORLD_GEOJSON =
		"https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";

	function bubbleSize(visitors: number) {
		return Math.round(10 + Math.sqrt(visitors) * 2.2);
	}
</script>

<div class="flex min-h-screen items-center justify-center p-8">
	<Card.Root class="relative aspect-[16/10] w-full max-w-md overflow-hidden py-0">
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

		<Card.Header
			class="from-card via-card/85 to-card/0 relative z-10 gap-1 rounded-t-[inherit] bg-linear-to-b pt-4 pb-10 mask-[linear-gradient(to_bottom,black_calc(100%_-_2.5rem),transparent)] backdrop-blur-[2px]"
		>
			<Card.Description>Visitors</Card.Description>
			<Card.Title class="text-lg tabular-nums">{totalVisitors}</Card.Title>

			<Card.Action>
				<Badge variant="outline">
					<TrendingUp />
					{visitorGrowth} growth
				</Badge>
			</Card.Action>
		</Card.Header>
	</Card.Root>
</div>
