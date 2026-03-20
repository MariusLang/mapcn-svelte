<script lang="ts">
	import { useMap } from "$lib/hooks/use-map.svelte.js";

	const EARTHQUAKE_GEOJSON_URL =
		"https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson";

	const HEATMAP_GRADIENT_COLORS = ["#fff7bc", "#fee391", "#fec44f", "#fe9929", "#d7301f"];

	const HEATMAP_COLOR_STOPS: [number, string][] = [
		[0.15, HEATMAP_GRADIENT_COLORS[0]],
		[0.35, HEATMAP_GRADIENT_COLORS[1]],
		[0.55, HEATMAP_GRADIENT_COLORS[2]],
		[0.75, HEATMAP_GRADIENT_COLORS[3]],
		[1, HEATMAP_GRADIENT_COLORS[4]],
	];

	const sourceId = "heatmap-earthquake-source";
	const heatLayerId = "heatmap-earthquake-layer";
	const pointLayerId = "heatmap-earthquake-point";

	const { map, isLoaded } = useMap();

	$effect(() => {
		if (!map || !isLoaded) return;

		if (!map.getSource(sourceId)) {
			map.addSource(sourceId, {
				type: "geojson",
				data: EARTHQUAKE_GEOJSON_URL,
			});
		}

		if (!map.getLayer(heatLayerId)) {
			map.addLayer({
				id: heatLayerId,
				type: "heatmap",
				source: sourceId,
				maxzoom: 6,
				paint: {
					"heatmap-weight": ["interpolate", ["linear"], ["get", "mag"], 0, 0, 6, 0.8],
					"heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 0.55, 6, 1.25],
					"heatmap-color": [
						"interpolate",
						["linear"],
						["heatmap-density"],
						0,
						"rgba(59, 130, 246, 0)",
						...HEATMAP_COLOR_STOPS.flat(),
					],
					"heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 8, 6, 34],
					"heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 4.5, 0.75, 6.5, 0.08],
				},
			});
		}

		if (!map.getLayer(pointLayerId)) {
			map.addLayer({
				id: pointLayerId,
				type: "circle",
				source: sourceId,
				minzoom: 4.5,
				paint: {
					"circle-radius": ["interpolate", ["linear"], ["get", "mag"], 1, 3, 6, 10],
					"circle-color": [
						"interpolate",
						["linear"],
						["get", "mag"],
						1,
						HEATMAP_GRADIENT_COLORS[1],
						2.5,
						HEATMAP_GRADIENT_COLORS[2],
						4,
						HEATMAP_GRADIENT_COLORS[3],
						6,
						HEATMAP_GRADIENT_COLORS[4],
					],
					"circle-stroke-width": 1,
					"circle-stroke-color": "rgba(255,255,255,0.8)",
					"circle-opacity": ["interpolate", ["linear"], ["zoom"], 4.5, 0, 6.5, 0.7],
				},
			});
		}

		return () => {
			try {
				if (map.getLayer(pointLayerId)) map.removeLayer(pointLayerId);
				if (map.getLayer(heatLayerId)) map.removeLayer(heatLayerId);
				if (map.getSource(sourceId)) map.removeSource(sourceId);
			} catch {
				// ignore
			}
		};
	});
</script>
