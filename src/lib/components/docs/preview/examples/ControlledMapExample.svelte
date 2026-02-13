<script lang="ts">
	import { Map } from "$lib/components/ui/map";
	import ViewportTracker from "./ControlledMapViewportTracker.svelte";

	interface MapViewport {
		center: [number, number];
		zoom: number;
		bearing: number;
		pitch: number;
	}

	let viewport = $state<MapViewport>({
		center: [-74.006, 40.7128],
		zoom: 8,
		bearing: 0,
		pitch: 0,
	});
</script>

<div class="relative h-[400px] w-full">
	<Map center={viewport.center} zoom={viewport.zoom}>
		<ViewportTracker bind:viewport />
		<div class="absolute left-2 top-2 z-10 flex flex-wrap gap-x-3 gap-y-1 rounded border bg-background/80 px-2 py-1.5 text-xs font-mono backdrop-blur">
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