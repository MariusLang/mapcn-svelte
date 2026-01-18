<script lang="ts">
	import { getContext } from "svelte";
	import MapLibreGL from "maplibre-gl";
	import { Button } from "$lib/registry/ui/button/index";
	import Navigation from "@lucide/svelte/icons/navigation";

	interface Props {
		destination: {
			name: string;
			description: string;
			center: [number, number];
		};
	}

	let { destination }: Props = $props();

	const mapCtx = getContext<{
		getMap: () => MapLibreGL.Map | null;
		isLoaded: () => boolean;
	}>("map");

	function handleFlyTo() {
		const map = mapCtx.getMap();
		if (!map || !mapCtx.isLoaded()) return;

		map.flyTo({
			center: destination.center,
			zoom: 14,
			duration: 2500,
		});
	}
</script>

<div class="absolute top-2 right-2 z-10">
	<Button size="icon-sm" variant="secondary" onclick={handleFlyTo}>
		<Navigation class="size-4" />
	</Button>
</div>
