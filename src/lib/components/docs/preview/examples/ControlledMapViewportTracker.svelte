<script lang="ts">
	import { getContext, onMount, onDestroy } from "svelte";
	import MapLibreGL from "maplibre-gl";

	interface MapViewport {
		center: [number, number];
		zoom: number;
		bearing: number;
		pitch: number;
	}

	interface Props {
		viewport: MapViewport;
	}

	// eslint-disable-next-line no-useless-assignment
	let { viewport = $bindable() }: Props = $props();

	const mapCtx = getContext<{
		getMap: () => MapLibreGL.Map | null;
		isLoaded: () => boolean;
	}>("map");

	let mapInstance: MapLibreGL.Map | null = null;

	function updateViewport() {
		if (!mapInstance) return;

		const center = mapInstance.getCenter();
		const newViewport = {
			center: [center.lng, center.lat] as [number, number],
			zoom: mapInstance.getZoom(),
			bearing: mapInstance.getBearing(),
			pitch: mapInstance.getPitch(),
		};
		viewport = newViewport;
	}

	onMount(() => {
		mapInstance = mapCtx.getMap();

		if (mapInstance) {
			mapInstance.on("move", updateViewport);
			updateViewport();
		}
	});

	onDestroy(() => {
		if (mapInstance) {
			mapInstance.off("move", updateViewport);
		}
	});
</script>
