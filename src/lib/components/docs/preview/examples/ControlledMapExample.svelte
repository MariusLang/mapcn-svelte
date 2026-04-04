<script lang="ts">
	import { Map } from "$lib/components/ui/map";
	import type { MapViewport } from "$lib/components/ui/map";

	let viewport = $state<MapViewport>({
		center: [-74.006, 40.7128],
		zoom: 8,
		bearing: 0,
		pitch: 0,
	});
</script>

<div class="relative h-[420px] w-full">
	<Map
		center={viewport.center}
		zoom={viewport.zoom}
		onviewportchange={(v) => (viewport = v)}
	>
		<div
			role="status"
			aria-live="polite"
			class="bg-background/80 absolute top-2 left-2 z-10 flex flex-wrap gap-x-3 gap-y-1 rounded border px-2 py-1.5 font-mono text-xs backdrop-blur"
		>
			<span>
				<span class="text-muted-foreground">lng:</span>
				{viewport.center[0].toFixed(3)}
			</span>
			<span>
				<span class="text-muted-foreground">lat:</span>
				{viewport.center[1].toFixed(3)}
			</span>
			<span>
				<span class="text-muted-foreground">zoom:</span>
				{viewport.zoom.toFixed(1)}
			</span>
			<span>
				<span class="text-muted-foreground">bearing:</span>
				{viewport.bearing.toFixed(1)}°
			</span>
			<span>
				<span class="text-muted-foreground">pitch:</span>
				{viewport.pitch.toFixed(1)}°
			</span>
		</div>
	</Map>
</div>
