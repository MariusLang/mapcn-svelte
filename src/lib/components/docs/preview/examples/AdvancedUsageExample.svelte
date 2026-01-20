<script lang="ts">
	import { Map } from "$lib/components/ui/map";
	import MapController from "./MapController.svelte";
</script>

<div class="relative h-[400px] w-full">
	<Map center={[-73.9857, 40.7484]} zoom={15}>
		<MapController />
	</Map>
</div>
