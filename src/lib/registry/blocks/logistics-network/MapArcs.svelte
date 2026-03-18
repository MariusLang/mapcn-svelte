<script lang="ts">
	import { useMap } from "$lib/hooks/use-map.svelte.js";
	import type MapLibreGL from "maplibre-gl";
	import { hubs, modeConfig, statusConfig, type Route } from "./data.js";

	interface Props {
		routes: Route[];
	}

	const { routes: arcRoutes }: Props = $props();

	const SOURCE_ID = "logistics-arcs-source";
	const LAYER_ID = "logistics-arcs-layer";

	function generateArc(
		start: [number, number],
		end: [number, number],
		segments = 50,
	): number[][] {
		const [x1, y1] = start;
		const [x2, y2] = end;
		const mx = (x1 + x2) / 2;
		const my = (y1 + y2) / 2;
		const dx = x2 - x1;
		const dy = y2 - y1;
		const dist = Math.sqrt(dx * dx + dy * dy);
		const nx = -dy / dist;
		const ny = dx / dist;
		const height = dist * 0.3;
		const cx = mx + nx * height;
		const cy = my + ny * height;

		const coords: number[][] = [];
		for (let i = 0; i <= segments; i++) {
			const t = i / segments;
			const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
			const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
			coords.push([px, py]);
		}
		return coords;
	}

	function getHubById(id: string) {
		return hubs.find((h) => h.id === id)!;
	}

	const { map, isLoaded } = useMap();

	const geoJSON = $derived.by<GeoJSON.FeatureCollection>(() => {
		const features: GeoJSON.Feature[] = arcRoutes.map((route) => {
			const fromHub = getHubById(route.from);
			const toHub = getHubById(route.to);
			const coordinates = generateArc([fromHub.lng, fromHub.lat], [toHub.lng, toHub.lat]);
			return {
				type: "Feature" as const,
				properties: {
					id: `${route.from}-${route.to}`,
					mode: route.mode,
					status: route.status,
					color:
						route.status === "delayed"
							? statusConfig.delayed.color
							: modeConfig[route.mode].color,
				},
				geometry: {
					type: "LineString" as const,
					coordinates,
				},
			};
		});
		return { type: "FeatureCollection", features };
	});

	$effect(() => {
		if (!map || !isLoaded) return;

		if (!map.getSource(SOURCE_ID)) {
			map.addSource(SOURCE_ID, { type: "geojson", data: geoJSON });
			map.addLayer({
				id: LAYER_ID,
				type: "line",
				source: SOURCE_ID,
				layout: { "line-join": "round", "line-cap": "round" },
				paint: {
					"line-color": ["get", "color"],
					"line-width": 2,
					"line-opacity": 0.65,
				},
			});
		} else {
			(map.getSource(SOURCE_ID) as MapLibreGL.GeoJSONSource).setData(geoJSON);
		}

		return () => {
			try {
				if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID);
				if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
			} catch {
				// ignore
			}
		};
	});

	$effect(() => {
		if (!map || !isLoaded) return;
		const source = map.getSource(SOURCE_ID) as MapLibreGL.GeoJSONSource | undefined;
		if (source) source.setData(geoJSON);
	});
</script>
