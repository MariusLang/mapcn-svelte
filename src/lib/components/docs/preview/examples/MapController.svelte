<script lang="ts">
	import { useMap } from "$lib/hooks/use-map.svelte";
	import { Button } from "$lib/registry/ui/button/index";
	import { RotateCcw, Mountain } from "lucide-svelte";

	let pitch = $state(0);
	let bearing = $state(0);

	const { map, isLoaded } = useMap();

	// Track pitch and bearing from the map instance
	$effect(() => {
		const mapInstance = map;
		if (!mapInstance || !isLoaded) return;

		// Initial values
		pitch = Math.round(mapInstance.getPitch());
		bearing = Math.round(mapInstance.getBearing());

		// Listen for map movements
		const onMove = () => {
			pitch = Math.round(mapInstance.getPitch());
			bearing = Math.round(mapInstance.getBearing());
		};

		mapInstance.on("move", onMove);

		return () => {
			mapInstance.off("move", onMove);
		};
	});

	function handle3DView() {
		map?.easeTo({
			pitch: 60,
			bearing: -20,
			duration: 1000,
		});
	}

	function handleReset() {
		map?.easeTo({
			pitch: 0,
			bearing: 0,
			duration: 1000,
		});
	}
</script>

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
