<script lang="ts">
	import { getContext } from "svelte";
	import MapLibreGL from "maplibre-gl";
	import { Map } from "$lib/components/ui/map";

	const mapCtx = getContext<{
		getMap: () => MapLibreGL.Map | null;
		isLoaded: () => boolean;
	}>("map");

	let hoveredFeatureId: string | number | null = $state(null);

	const nycParksGeoJSON = {
		type: "FeatureCollection" as const,
		features: [
			{
				type: "Feature" as const,
				id: "central-park",
				properties: { name: "Central Park" },
				geometry: {
					type: "Polygon" as const,
					coordinates: [
						[
							[-73.9732, 40.7644],
							[-73.9819, 40.7681],
							[-73.958, 40.8006],
							[-73.9494, 40.7969],
							[-73.9732, 40.7644],
						],
					],
				},
			},
			{
				type: "Feature" as const,
				id: "prospect-park",
				properties: { name: "Prospect Park" },
				geometry: {
					type: "Polygon" as const,
					coordinates: [
						[
							[-73.9732, 40.66],
							[-73.9695, 40.666],
							[-73.955, 40.66],
							[-73.952, 40.655],
							[-73.9732, 40.66],
						],
					],
				},
			},
			{
				type: "Feature" as const,
				id: "riverside-park",
				properties: { name: "Riverside Park" },
				geometry: {
					type: "Polygon" as const,
					coordinates: [
						[
							[-73.985, 40.79],
							[-73.975, 40.795],
							[-73.97, 40.8],
							[-73.96, 40.805],
							[-73.95, 40.81],
							[-73.955, 40.795],
							[-73.96, 40.79],
							[-73.97, 40.785],
							[-73.98, 40.788],
							[-73.985, 40.79],
						],
					],
				},
			},
		],
	};

	$effect(() => {
		const map = mapCtx.getMap();
		if (!map || !mapCtx.isLoaded()) return;

		// Add GeoJSON source
		map.addSource("parks", {
			type: "geojson",
			data: nycParksGeoJSON,
		});

		// Add fill layer
		map.addLayer({
			id: "parks-fill",
			type: "fill",
			source: "parks",
			layout: {},
			paint: {
				"fill-color": "#4ade80",
				"fill-opacity": 0.3,
			},
		});

		// Add outline layer
		map.addLayer({
			id: "parks-outline",
			type: "line",
			source: "parks",
			layout: {},
			paint: {
				"line-color": "#22c55e",
				"line-width": 2,
				"line-opacity": 0.8,
			},
		});

		// Add hover layer
		map.addLayer({
			id: "parks-hover",
			type: "fill",
			source: "parks",
			layout: {},
			paint: {
				"fill-color": "#86efac",
				"fill-opacity": 0.5,
			},
			filter: ["==", ["id"], ""],
		});

		const handleMouseEnter = (
			e: MapLibreGL.MapMouseEvent & { features?: MapLibreGL.MapGeoJSONFeature[] }
		) => {
			map.getCanvas().style.cursor = "pointer";
			if (e.features && e.features.length > 0 && e.features[0].id !== undefined) {
				hoveredFeatureId = e.features[0].id;
				map.setFilter("parks-hover", ["==", ["id"], hoveredFeatureId]);
			}
		};

		const handleMouseLeave = () => {
			map.getCanvas().style.cursor = "";
			hoveredFeatureId = null;
			map.setFilter("parks-hover", ["==", ["id"], ""]);
		};

		const handleClick = (
			e: MapLibreGL.MapMouseEvent & { features?: MapLibreGL.MapGeoJSONFeature[] }
		) => {
			if (e.features && e.features.length > 0) {
				const feature = e.features[0];
				const name = feature.properties?.name || "Unknown Park";
				const coords = e.lngLat;

				// Create popup
				new MapLibreGL.Popup()
					.setLngLat(coords)
					.setHTML(
						`<strong>${name}</strong><br>Lat: ${coords.lat.toFixed(4)}<br>Lng: ${coords.lng.toFixed(4)}`
					)
					.addTo(map);
			}
		};

		map.on("mousemove", "parks-fill", handleMouseEnter);
		map.on("mouseleave", "parks-fill", handleMouseLeave);
		map.on("click", "parks-fill", handleClick);

		return () => {
			map.off("mousemove", "parks-fill", handleMouseEnter);
			map.off("mouseleave", "parks-fill", handleMouseLeave);
			map.off("click", "parks-fill", handleClick);

			// Remove layers and source
			if (map.getLayer("parks-hover")) map.removeLayer("parks-hover");
			if (map.getLayer("parks-outline")) map.removeLayer("parks-outline");
			if (map.getLayer("parks-fill")) map.removeLayer("parks-fill");
			if (map.getSource("parks")) map.removeSource("parks");
		};
	});
</script>

<div class="h-[500px] w-full">
	<Map center={[-73.965, 40.78]} zoom={12}>
		<div
			class="absolute top-4 left-4 z-10 rounded-lg border bg-white p-3 shadow-lg dark:bg-gray-900"
		>
			<p class="text-sm font-medium">NYC Parks Layer</p>
			<p class="text-muted-foreground text-xs">Hover to highlight, click for details</p>
		</div>
	</Map>
</div>
