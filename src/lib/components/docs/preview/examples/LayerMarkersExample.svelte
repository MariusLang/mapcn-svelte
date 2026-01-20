<script lang="ts">
	import MapLibreGL from "maplibre-gl";
	import { Map, MapPopup } from "$lib/components/ui/map";
	import { getContext } from "svelte";

	// Generate random points around NYC
	function generateRandomPoints(count: number) {
		const center = { lng: -73.98, lat: 40.75 };
		const features = [];

		for (let i = 0; i < count; i++) {
			const lng = center.lng + (Math.random() - 0.5) * 0.15;
			const lat = center.lat + (Math.random() - 0.5) * 0.1;
			features.push({
				type: "Feature" as const,
				properties: {
					id: i,
					name: `Location ${i + 1}`,
					category: ["Restaurant", "Cafe", "Bar", "Shop"][Math.floor(Math.random() * 4)],
				},
				geometry: {
					type: "Point" as const,
					coordinates: [lng, lat],
				},
			});
		}

		return {
			type: "FeatureCollection" as const,
			features,
		};
	}

	// 200 markers - would be slow with DOM markers, but fast with layers
	const pointsData = generateRandomPoints(200);

	interface SelectedPoint {
		id: number;
		name: string;
		category: string;
		coordinates: [number, number];
	}

	let selectedPoint: SelectedPoint | null = $state(null);

	// Store cleanup function
	let layerCleanup: (() => void) | null = null;

	// Setup map layers - called when Map renders its children
	function setupMapLayers() {
		const mapCtx = getContext<{
			getMap: () => MapLibreGL.Map | null;
			isLoaded: () => boolean;
		}>("map");

		const instanceId = Math.random().toString(36).substring(2, 9);
		const sourceId = `markers-source-${instanceId}`;
		const layerId = `markers-layer-${instanceId}`;

		const map = mapCtx?.getMap();
		if (!map || !mapCtx?.isLoaded()) return;

		if (map.getSource(sourceId)) return;

		map.addSource(sourceId, {
			type: "geojson",
			data: pointsData,
		});

		map.addLayer({
			id: layerId,
			type: "circle",
			source: sourceId,
			paint: {
				"circle-radius": 6,
				"circle-color": "#3b82f6",
				"circle-stroke-width": 2,
				"circle-stroke-color": "#ffffff",
			},
		});

		const handleClick = (
			e: MapLibreGL.MapMouseEvent & { features?: MapLibreGL.MapGeoJSONFeature[] }
		) => {
			if (!e.features?.length) return;

			const feature = e.features[0];
			const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];

			selectedPoint = {
				id: feature.properties?.id,
				name: feature.properties?.name,
				category: feature.properties?.category,
				coordinates: coords,
			};
		};

		const handleMouseEnter = () => {
			map.getCanvas().style.cursor = "pointer";
		};

		const handleMouseLeave = () => {
			map.getCanvas().style.cursor = "";
		};

		map.on("click", layerId, handleClick);
		map.on("mouseenter", layerId, handleMouseEnter);
		map.on("mouseleave", layerId, handleMouseLeave);

		// Store cleanup function
		layerCleanup = () => {
			map.off("click", layerId, handleClick);
			map.off("mouseenter", layerId, handleMouseEnter);
			map.off("mouseleave", layerId, handleMouseLeave);

			try {
				if (map.getLayer(layerId)) map.removeLayer(layerId);
				if (map.getSource(sourceId)) map.removeSource(sourceId);
			} catch {
				// ignore cleanup errors
			}
		};
	}

	// Cleanup on unmount
	$effect(() => {
		return () => {
			if (layerCleanup) {
				layerCleanup();
				layerCleanup = null;
			}
		};
	});
</script>

<div class="h-[400px] w-full">
	<Map center={[-73.98, 40.75]} zoom={11}>
		<!-- Call setup function - this code runs in Map's context where map context is available -->
		{setupMapLayers()}

		{#if selectedPoint}
			<MapPopup
				longitude={selectedPoint.coordinates[0]}
				latitude={selectedPoint.coordinates[1]}
				onclose={() => (selectedPoint = null)}
				closeOnClick={false}
				focusAfterOpen={false}
				offset={10}
				closeButton
			>
				<div class="min-w-[140px]">
					<p class="font-medium">{selectedPoint.name}</p>
					<p class="text-muted-foreground text-sm">{selectedPoint.category}</p>
				</div>
			</MapPopup>
		{/if}
	</Map>
</div>
