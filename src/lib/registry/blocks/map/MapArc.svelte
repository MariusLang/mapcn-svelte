<script lang="ts" module>
	import type MapLibreGL from "maplibre-gl";

	export type MapArcDatum = {
		/** Unique identifier for this arc. Required for hover state tracking. */
		id: string | number;
		/** Start coordinate as [longitude, latitude]. */
		from: [number, number];
		/** End coordinate as [longitude, latitude]. */
		to: [number, number];
	};

	export type MapArcEvent<T extends MapArcDatum = MapArcDatum> = {
		arc: T;
		longitude: number;
		latitude: number;
		originalEvent: MapLibreGL.MapMouseEvent;
	};

	type MapArcLinePaint = NonNullable<MapLibreGL.LineLayerSpecification["paint"]>;
	type MapArcLineLayout = NonNullable<MapLibreGL.LineLayerSpecification["layout"]>;

	export type MapArcProps<T extends MapArcDatum = MapArcDatum> = {
		/** Array of arcs to render. Each arc must have a unique `id`. */
		data: T[];
		/** Optional unique identifier prefix for the arc source/layers. */
		id?: string;
		/**
		 * How far each arc bows away from a straight line. `0` renders straight lines;
		 * higher values bend further. Negative values bend to the opposite side. (default: 0.2)
		 */
		curvature?: number;
		/** Number of samples used to render each curve. Higher = smoother. (default: 64) */
		samples?: number;
		/** MapLibre paint properties for the arc layer. */
		paint?: MapArcLinePaint;
		/** MapLibre layout properties for the arc layer. */
		layout?: MapArcLineLayout;
		/** Paint properties applied to the arc currently under the cursor. */
		hoverPaint?: MapArcLinePaint;
		/** Callback when an arc is clicked. */
		onclick?: (e: MapArcEvent<T>) => void;
		/** Callback fired when the hovered arc changes. */
		onhover?: (e: MapArcEvent<T> | null) => void;
		/** Whether arcs respond to mouse events. (default: true) */
		interactive?: boolean;
		/** Optional MapLibre layer id to insert the arc layers before. */
		beforeId?: string;
	};
</script>

<script lang="ts" generics="T extends MapArcDatum = MapArcDatum">
	import { useMap } from "$lib/hooks/use-map.svelte.js";

	let {
		data,
		id: propId,
		curvature = 0.2,
		samples = 64,
		paint,
		layout,
		hoverPaint,
		onclick,
		onhover,
		interactive = true,
		beforeId,
	}: MapArcProps<T> = $props();

	const DEFAULT_PAINT: NonNullable<MapLibreGL.LineLayerSpecification["paint"]> = {
		"line-color": "#4285F4",
		"line-width": 2,
		"line-opacity": 0.85,
	};

	const DEFAULT_LAYOUT: NonNullable<MapLibreGL.LineLayerSpecification["layout"]> = {
		"line-join": "round",
		"line-cap": "round",
	};

	const ARC_HIT_MIN_WIDTH = 12;
	const ARC_HIT_PADDING = 6;

	let autoId = $state(Math.random().toString(36).slice(2));
	const id = $derived(propId ?? autoId);
	const sourceId = $derived(`arc-source-${id}`);
	const layerId = $derived(`arc-layer-${id}`);
	const hitLayerId = $derived(`arc-hit-layer-${id}`);

	const { map, isLoaded } = useMap();

	function buildArcCoordinates(
		from: [number, number],
		to: [number, number],
		curvature: number,
		samples: number,
	): [number, number][] {
		const [x0, y0] = from;
		const [x2, y2] = to;
		const dx = x2 - x0;
		const dy = y2 - y0;
		const distance = Math.hypot(dx, dy);

		if (distance === 0 || curvature === 0) return [from, to];

		const mx = (x0 + x2) / 2;
		const my = (y0 + y2) / 2;
		const nx = -dy / distance;
		const ny = dx / distance;
		const offset = distance * curvature;
		const cx = mx + nx * offset;
		const cy = my + ny * offset;

		const points: [number, number][] = [];
		const segments = Math.max(2, Math.floor(samples));
		for (let i = 0; i <= segments; i++) {
			const t = i / segments;
			const inv = 1 - t;
			const x = inv * inv * x0 + 2 * inv * t * cx + t * t * x2;
			const y = inv * inv * y0 + 2 * inv * t * cy + t * t * y2;
			points.push([x, y]);
		}
		return points;
	}

	function mergeArcPaint(
		base: NonNullable<MapLibreGL.LineLayerSpecification["paint"]>,
		hover: NonNullable<MapLibreGL.LineLayerSpecification["paint"]> | undefined,
	): NonNullable<MapLibreGL.LineLayerSpecification["paint"]> {
		if (!hover) return base;
		const merged: Record<string, unknown> = { ...base };
		for (const [key, hoverValue] of Object.entries(hover)) {
			if (hoverValue === undefined) continue;
			const baseValue = merged[key];
			merged[key] =
				baseValue === undefined
					? hoverValue
					: ["case", ["boolean", ["feature-state", "hover"], false], hoverValue, baseValue];
		}
		return merged as NonNullable<MapLibreGL.LineLayerSpecification["paint"]>;
	}

	const geoJSON = $derived.by<GeoJSON.FeatureCollection<GeoJSON.LineString>>(() => ({
		type: "FeatureCollection",
		features: data.map((arc) => {
			const { from, to, id: arcId, ...properties } = arc;
			return {
				id: typeof arcId === "number" ? arcId : undefined,
				type: "Feature" as const,
				properties: { ...properties, _arc_id: String(arcId) },
				geometry: {
					type: "LineString" as const,
					coordinates: buildArcCoordinates(from, to, curvature, samples),
				},
			};
		}),
	}));

	const mergedPaint = $derived(mergeArcPaint({ ...DEFAULT_PAINT, ...paint }, hoverPaint));
	const mergedLayout = $derived({ ...DEFAULT_LAYOUT, ...layout });
	const hitWidth = $derived(() => {
		const w = paint?.["line-width"] ?? DEFAULT_PAINT["line-width"];
		const base = typeof w === "number" ? w : ARC_HIT_MIN_WIDTH;
		return Math.max((base as number) + ARC_HIT_PADDING, ARC_HIT_MIN_WIDTH);
	});

	let hoveredArcId: string | null = null;

	function getArcById(arcId: string): T | undefined {
		return data.find((a) => String(a.id) === arcId);
	}

	$effect(() => {
		if (!map || !isLoaded) return;

		const currentSourceId = sourceId;
		const currentLayerId = layerId;
		const currentHitLayerId = hitLayerId;

		if (!map.getSource(currentSourceId)) {
			map.addSource(currentSourceId, {
				type: "geojson",
				data: geoJSON,
				promoteId: "_arc_id",
			});

			map.addLayer(
				{
					id: currentLayerId,
					type: "line",
					source: currentSourceId,
					layout: mergedLayout,
					paint: mergedPaint,
				},
				beforeId,
			);

			if (interactive) {
				map.addLayer(
					{
						id: currentHitLayerId,
						type: "line",
						source: currentSourceId,
						layout: mergedLayout,
						paint: { "line-color": "transparent", "line-width": hitWidth() },
					},
					beforeId,
				);
			}
		}

		return () => {
			try {
				if (map.getLayer(currentHitLayerId)) map.removeLayer(currentHitLayerId);
				if (map.getLayer(currentLayerId)) map.removeLayer(currentLayerId);
				if (map.getSource(currentSourceId)) map.removeSource(currentSourceId);
			} catch {
				// ignore
			}
		};
	});

	// Update GeoJSON data reactively
	$effect(() => {
		if (!map || !isLoaded) return;
		const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource | undefined;
		if (source) source.setData(geoJSON);
	});

	// Update paint reactively
	$effect(() => {
		if (!map || !isLoaded) return;
		if (map.getLayer(layerId)) {
			for (const [key, value] of Object.entries(mergedPaint)) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				map.setPaintProperty(layerId, key as any, value);
			}
		}
	});

	// Wire up interaction events
	$effect(() => {
		if (!map || !isLoaded || !interactive) return;

		const targetLayer = hitLayerId;

		const handleClick = (e: MapLibreGL.MapMouseEvent) => {
			if (!onclick) return;
			const features = map.queryRenderedFeatures(e.point, { layers: [targetLayer] });
			if (!features.length) return;
			const arcId = features[0].properties?._arc_id;
			if (!arcId) return;
			const arc = getArcById(arcId);
			if (!arc) return;
			onclick({ arc, longitude: e.lngLat.lng, latitude: e.lngLat.lat, originalEvent: e });
		};

		const handleMouseMove = (e: MapLibreGL.MapMouseEvent) => {
			const features = map.queryRenderedFeatures(e.point, { layers: [targetLayer] });
			const arcId = features.length ? features[0].properties?._arc_id : null;

			if (arcId === hoveredArcId) return;

			if (hoveredArcId !== null) {
				map.setFeatureState({ source: sourceId, id: hoveredArcId }, { hover: false });
				hoveredArcId = null;
			}

			if (arcId) {
				map.setFeatureState({ source: sourceId, id: arcId }, { hover: true });
				hoveredArcId = arcId;
				map.getCanvas().style.cursor = "pointer";

				if (onhover) {
					const arc = getArcById(arcId);
					if (arc) {
						onhover({ arc, longitude: e.lngLat.lng, latitude: e.lngLat.lat, originalEvent: e });
					}
				}
			} else {
				map.getCanvas().style.cursor = "";
				if (onhover) onhover(null);
			}
		};

		const handleMouseLeave = () => {
			if (hoveredArcId !== null) {
				map.setFeatureState({ source: sourceId, id: hoveredArcId }, { hover: false });
				hoveredArcId = null;
			}
			map.getCanvas().style.cursor = "";
			if (onhover) onhover(null);
		};

		map.on("click", targetLayer, handleClick);
		map.on("mousemove", targetLayer, handleMouseMove);
		map.on("mouseleave", targetLayer, handleMouseLeave);

		return () => {
			map.off("click", targetLayer, handleClick);
			map.off("mousemove", targetLayer, handleMouseMove);
			map.off("mouseleave", targetLayer, handleMouseLeave);
		};
	});
</script>
