<script lang="ts">
	import { getContext } from "svelte";
	import MapLibreGL from "maplibre-gl";
	import { Map } from "$lib/components/ui/map";
	import { Button } from "$lib/registry/ui/button/index";
	import { RotateCcw, Mountain } from "lucide-svelte";

	let pitch = $state(0);
	let bearing = $state(0);
	let isLoaded = $state(false);

	// Access map context when component mounts
	$effect(() => {
		const mapCtx = getContext<{
			getMap: () => MapLibreGL.Map | null;
			isLoaded: () => boolean;
		}>("map");

		const map = mapCtx?.getMap();
		if (!map || !mapCtx?.isLoaded()) return;

		isLoaded = true;

		const handleMove = () => {
			pitch = Math.round(map.getPitch());
			bearing = Math.round(map.getBearing());
		};

		map.on("move", handleMove);

		return () => {
			map.off("move", handleMove);
		};
	});

	function handle3DView() {
		const mapCtx = getContext<{
			getMap: () => MapLibreGL.Map | null;
			isLoaded: () => boolean;
		}>("map");

		const map = mapCtx?.getMap();
		if (!map || !mapCtx?.isLoaded()) return;
		map.easeTo({
			pitch: 60,
			bearing: -20,
			duration: 1000,
		});
	}

	function handleReset() {
		const mapCtx = getContext<{
			getMap: () => MapLibreGL.Map | null;
			isLoaded: () => boolean;
		}>("map");

		const map = mapCtx?.getMap();
		if (!map || !mapCtx?.isLoaded()) return;
		map.easeTo({
			pitch: 0,
			bearing: 0,
			duration: 1000,
		});
	}
</script>

<div class="relative h-100 w-full">
	<Map center={[-73.9857, 40.7484]} zoom={15}>
		{#if isLoaded}
			<div class="absolute top-3 left-3 z-10 flex flex-col gap-2">
				<div class="flex gap-2">
					<Button size="sm" variant="secondary" onclick={handle3DView}>
						<Mountain class="mr-1.5 size-4" />
						3D View
					</Button>
					<Button size="sm" variant="secondary" onclick={handleReset}>
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
