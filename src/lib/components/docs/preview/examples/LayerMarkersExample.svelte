<script lang="ts">
	import { getContext } from "svelte";
	import MapLibreGL from "maplibre-gl";
	import { Map } from "$lib/components/ui/map";
	import MapControls from "$lib/registry/blocks/map/MapControls.svelte";

	const mapCtx = getContext<{
		getMap: () => MapLibreGL.Map | null;
		isLoaded: () => boolean;
	}>("map");

	// Generate 100 random markers around NYC
	function generateMarkers(count: number) {
		const markers = [];
		for (let i = 0; i < count; i++) {
			markers.push({
				type: "Feature" as const,
				properties: {
					id: i,
					name: `Marker ${i + 1}`,
				},
				geometry: {
					type: "Point" as const,
					coordinates: [-74 + (Math.random() - 0.5) * 0.2, 40.7 + (Math.random() - 0.5) * 0.2],
				},
			});
		}
		return markers;
	}

	const markersGeoJSON = {
		type: "FeatureCollection" as const,
		features: generateMarkers(100),
	};

	$effect(() => {
		const map = mapCtx.getMap();
		if (!map || !mapCtx.isLoaded()) return;

		// Add GeoJSON source
		map.addSource("markers", {
			type: "geojson",
			data: markersGeoJSON,
			cluster: true,
			clusterMaxZoom: 14,
			clusterRadius: 50,
		});

		// Add cluster circles
		map.addLayer({
			id: "clusters",
			type: "circle",
			source: "markers",
			filter: ["has", "point_count"],
			paint: {
				"circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
				"circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
			},
		});

		// Add cluster numbers
		map.addLayer({
			id: "cluster-count",
			type: "symbol",
			source: "markers",
			filter: ["has", "point_count"],
			layout: {
				"text-field": "{point_count_abbreviated}",
				"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
				"text-size": 12,
			},
			paint: {
				"text-color": "#ffffff",
			},
		});

		// Add unclustered points
		map.addLayer({
			id: "unclustered-point",
			type: "circle",
			source: "markers",
			filter: ["!", ["has", "point_count"]],
			paint: {
				"circle-color": "#11b4da",
				"circle-radius": 4,
				"circle-stroke-width": 1,
				"circle-stroke-color": "#fff",
			},
		});

		// Add hover layer
		map.addLayer({
			id: "unclustered-point-hover",
			type: "circle",
			source: "markers",
			filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "id"], -1]],
			paint: {
				"circle-color": "#f28cb1",
				"circle-radius": 8,
				"circle-stroke-width": 2,
				"circle-stroke-color": "#fff",
			},
		});

		const handleMouseEnter = (
			e: MapLibreGL.MapMouseEvent & { features?: MapLibreGL.MapGeoJSONFeature[] }
		) => {
			map.getCanvas().style.cursor = "pointer";
			if (e.features && e.features.length > 0) {
				const id = e.features[0].properties?.id;
				map.setFilter("unclustered-point-hover", ["==", ["get", "id"], id]);
			}
		};

		const handleMouseLeave = () => {
			map.getCanvas().style.cursor = "";
			map.setFilter("unclustered-point-hover", ["==", ["get", "id"], -1]);
		};

		const handleClick = (e: MapLibreGL.MapMouseEvent) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: ["unclustered-point"],
			});

			if (features && features.length > 0) {
				const feature = features[0];
				const coords = e.lngLat;
				const name = feature.properties?.name || "Unknown Marker";

				new MapLibreGL.Popup()
					.setLngLat(coords)
					.setHTML(
						`<strong>${name}</strong><br>Lat: ${coords.lat.toFixed(4)}<br>Lng: ${coords.lng.toFixed(4)}`
					)
					.addTo(map);
			}
		};

		map.on("mousemove", "unclustered-point", handleMouseEnter);
		map.on("mouseleave", "unclustered-point", handleMouseLeave);
		map.on("click", "unclustered-point", handleClick);

		return () => {
			map.off("mousemove", "unclustered-point", handleMouseEnter);
			map.off("mouseleave", "unclustered-point", handleMouseLeave);
			map.off("click", "unclustered-point", handleClick);

			// Remove layers and source
			if (map.getLayer("unclustered-point-hover")) map.removeLayer("unclustered-point-hover");
			if (map.getLayer("unclustered-point")) map.removeLayer("unclustered-point");
			if (map.getLayer("cluster-count")) map.removeLayer("cluster-count");
			if (map.getLayer("clusters")) map.removeLayer("clusters");
			if (map.getSource("markers")) map.removeSource("markers");
		};
	});
</script>

<div class="h-[500px] w-full">
	<Map center={[-74, 40.7]} zoom={11}>
		<div
			class="absolute top-4 left-4 z-10 rounded-lg border bg-white p-3 shadow-lg dark:bg-gray-900"
		>
			<p class="text-sm font-medium">100 Markers via GeoJSON Layer</p>
			<p class="text-muted-foreground text-xs">Much faster than DOM markers</p>
		</div>
		<MapControls position="bottom-right" showZoom showCompass showLocate showFullscreen />
	</Map>
</div>
