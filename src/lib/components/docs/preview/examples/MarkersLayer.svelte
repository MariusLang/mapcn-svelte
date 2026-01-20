<script lang="ts">
	import { getContext } from "svelte";
	import MapLibreGL from "maplibre-gl";
	import { MapPopup } from "$lib/components/ui/map";

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

	// Generate unique ID for this component instance
	let instanceId = $derived.by(() => {
		return Math.random().toString(36).substring(2, 9);
	});
	let sourceId = $derived(`markers-source-${instanceId}`);
	let layerId = $derived(`markers-layer-${instanceId}`);

	let selectedPoint: SelectedPoint | null = $state(null);

	const mapCtx = getContext<{
		getMap: () => MapLibreGL.Map | null;
		isLoaded: () => boolean;
	}>("map");

	$effect(() => {
		const map = mapCtx?.getMap();
		if (!map || !mapCtx?.isLoaded()) return;

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
				// add more paint properties here to customize the appearance of the markers
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

		return () => {
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
	});
</script>

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
