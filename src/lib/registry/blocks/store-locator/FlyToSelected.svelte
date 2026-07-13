<script lang="ts">
	import { useMap } from "$lib/components/ui/map";
	import type { Store } from "./data";

	let { store }: { store?: Store } = $props();

	const mapCtx = useMap();

	$effect(() => {
		const map = mapCtx.map;
		if (!map || !store) return;
		map.flyTo({
			center: [store.lng, store.lat],
			zoom: 14,
			duration: 800,
			essential: true,
		});
	});
</script>
