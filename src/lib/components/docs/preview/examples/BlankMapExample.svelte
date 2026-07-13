<script lang="ts">
	import { Map, MapGeoJSON } from "$lib/registry/blocks/map";
	import { WORLD_GEOJSON } from "$lib/use-world-data.svelte";
</script>

<div class="h-[420px] w-full">
	<Map blank center={[10, 25]}>
		<MapGeoJSON data={WORLD_GEOJSON} />
	</Map>
</div>
