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

	let { viewport = $bindable() }: Props = $props();

	const mapCtx = getContext<{
		getMap: () => MapLibreGL.Map | null;
		isLoaded: () => boolean;
	}>("map");

	let mapInstance: MapLibreGL.Map | null = null;

	function updateViewport() {
		if (!mapInstance) return;

		const center = mapInstance.getCenter();
		viewport = {
			center: [center.lng, center.lat],
			zoom: mapInstance.getZoom(),
			bearing: mapInstance.getBearing(),
			pitch: mapInstance.getPitch(),
		};
	}

	onMount(() => {
		mapInstance = mapCtx.getMap();
		
		if (mapInstance) {
			mapInstance.on("move", updateViewport);
			mapInstance.on("zoom", updateViewport);
			mapInstance.on("rotate", updateViewport);
			mapInstance.on("pitch", updateViewport);
			
			// Initialize viewport with current map state
			updateViewport();
		}
	});

	onDestroy(() => {
		if (mapInstance) {
			mapInstance.off("move", updateViewport);
			mapInstance.off("zoom", updateViewport);
			mapInstance.off("rotate", updateViewport);
			mapInstance.off("pitch", updateViewport);
		}
	});
</script>
