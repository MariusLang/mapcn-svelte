<script lang="ts">
	import { Map, MapControls } from "$lib/components/ui/map";
</script>

<div class="h-[400px] w-full">
	<Map center={[2.3522, 48.8566]} zoom={11}>
		<MapControls position="bottom-right" showZoom showCompass showLocate showFullscreen />
	</Map>
</div>
