<script lang="ts">
	import {
		Map,
		MapMarker,
		MarkerContent,
		MarkerPopup,
		MarkerTooltip,
	} from "$lib/components/ui/map";

	const locations = [
		{
			id: 1,
			name: "Empire State Building",
			lng: -73.9857,
			lat: 40.7484,
		},
		{
			id: 2,
			name: "Central Park",
			lng: -73.9654,
			lat: 40.7829,
		},
		{
			id: 3,
			name: "Times Square",
			lng: -73.9855,
			lat: 40.758,
		},
	];
</script>

<div class="h-[400px] w-full">
	<Map center={[-73.98, 40.76]} zoom={12}>
		{#each locations as location (location.id)}
			<MapMarker longitude={location.lng} latitude={location.lat}>
				<MarkerContent>
					<div class="bg-primary size-4 rounded-full border-2 border-white shadow-lg"></div>
				</MarkerContent>

				<MarkerTooltip>
					{location.name}
				</MarkerTooltip>

				<MarkerPopup>
					<div class="space-y-1">
						<p class="text-foreground font-medium">
							{location.name}
						</p>
						<p class="text-muted-foreground text-xs">
							{location.lat.toFixed(4)}, {location.lng.toFixed(4)}
						</p>
					</div>
				</MarkerPopup>
			</MapMarker>
		{/each}
	</Map>
</div>
