<script lang="ts">
	import { useMap } from "$lib/hooks/use-map.svelte.js";
	import type { Store } from "./data";

	let { store }: { store?: Store } = $props();

	const { map } = useMap();

	$effect(() => {
		if (!map || !store) return;
		map.flyTo({
			center: [store.lng, store.lat],
			zoom: 14,
			duration: 800,
			essential: true,
		});
	});
</script>
