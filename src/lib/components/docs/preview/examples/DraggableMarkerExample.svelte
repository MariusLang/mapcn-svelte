<script lang="ts">
	import { Map, MapMarker, MarkerContent, MarkerPopup } from "$lib/components/ui/map";
	import MapPin from "@lucide/svelte/icons/map-pin";

	let markerPosition = $state({
		lng: -73.98,
		lat: 40.75,
	});

	function handleDragEnd(e: { lng: number; lat: number }) {
		markerPosition = { lng: e.lng, lat: e.lat };
	}
</script>

<div class="h-100 w-full">
	<Map center={[-73.98, 40.75]} zoom={12}>
		<MapMarker
			longitude={markerPosition.lng}
			latitude={markerPosition.lat}
			draggable
			ondragend={handleDragEnd}
		>
			<MarkerContent>
				<div class="cursor-move">
					<MapPin class="fill-black stroke-white dark:fill-white" size={28} />
				</div>
			</MarkerContent>

			<MarkerPopup>
				<div class="space-y-1">
					<p class="text-foreground font-medium">Coordinates</p>
					<p class="text-muted-foreground text-xs">
						{markerPosition.lat.toFixed(4)},{markerPosition.lng.toFixed(4)}
					</p>
				</div>
			</MarkerPopup>
		</MapMarker>
	</Map>
</div>
