<script lang="ts">
	import { Map } from "$lib/components/ui/map";
	import MarkersLayer from "./MarkersLayer.svelte";
</script>

<div class="h-[400px] w-full">
	<Map center={[-73.98, 40.75]} zoom={11}>
		<MarkersLayer />
	</Map>
</div>
