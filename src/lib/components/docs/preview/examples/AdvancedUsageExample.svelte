<script lang="ts">
	import { Map } from "$lib/components/ui/map";
	import MapLibreGL from "maplibre-gl";
	import { Button } from "$lib/registry/ui/button/index";
	import { RotateCcw, Mountain } from "@lucide/svelte";

	let mapInstance = $state<MapLibreGL.Map | null>(null);
	let isLoaded = $state(false);
	let pitch = $state(0);
	let bearing = $state(0);

	function handleStyleLoaded() {
		isLoaded = true;
		pitch = Math.round(mapInstance?.getPitch() ?? 0);
		bearing = Math.round(mapInstance?.getBearing() ?? 0);
	}
</script>

<div class="relative h-[420px] w-full">
	<Map
		center={[-73.9857, 40.7484]}
		zoom={15}
		bind:map={mapInstance}
		onstyleloaded={handleStyleLoaded}
		onviewportchange={(v) => {
			pitch = Math.round(v.pitch);
			bearing = Math.round(v.bearing);
		}}
	>
		{#if isLoaded}
			<div class="absolute top-3 left-3 z-10 flex flex-col gap-2">
				<div class="flex gap-2">
					<Button
						size="sm"
						variant="secondary"
						onclick={() => mapInstance?.easeTo({ pitch: 60, bearing: -20, duration: 1000 })}
					>
						<Mountain class="mr-1.5 size-4" />
						3D View
					</Button>
					<Button
						size="sm"
						variant="secondary"
						onclick={() => mapInstance?.easeTo({ pitch: 0, bearing: 0, duration: 1000 })}
					>
						<RotateCcw class="mr-1.5 size-4" />
						Reset
					</Button>
				</div>
				<div
					class="border-border bg-background/90 rounded-md border px-3 py-2 font-mono text-xs backdrop-blur"
				>
					<div>Pitch: {pitch}°</div>
					<div>Bearing: {bearing}°</div>
				</div>
			</div>
		{/if}
	</Map>
</div>
