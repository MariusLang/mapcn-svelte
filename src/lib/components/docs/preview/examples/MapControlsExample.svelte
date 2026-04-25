<script lang="ts">
	import { Map, MapControls } from "$lib/components/ui/map";
</script>

<div class="h-[420px] w-full">
	<Map center={[2.3522, 48.8566]} zoom={8.5}>
		<MapControls position="top-right" showZoom showCompass showLocate showFullscreen />
	</Map>
</div>
