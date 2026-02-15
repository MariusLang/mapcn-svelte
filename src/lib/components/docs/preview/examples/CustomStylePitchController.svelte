<script lang="ts">
	import { getContext, onMount } from "svelte";
	import MapLibreGL from "maplibre-gl";

	interface Props {
		style: "default" | "openstreetmap" | "openstreetmap3d";
	}

	let { style }: Props = $props();

	const mapCtx = getContext<{
		getMap: () => MapLibreGL.Map | null;
		isLoaded: () => boolean;
	}>("map");

	let mapInstance: MapLibreGL.Map | null = null;

	onMount(() => {
		mapInstance = mapCtx.getMap();
	});

	$effect(() => {
		if (!mapInstance) return;

		const is3D = style === "openstreetmap3d";
		mapInstance.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
	});
</script>
