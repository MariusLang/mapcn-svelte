<script lang="ts" module>
	import type MapLibreGL from "maplibre-gl";
	import type * as GeoJSON from "geojson";

	export type MapGeoJSONData<P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties> =
		| GeoJSON.FeatureCollection<GeoJSON.Geometry, P>
		| GeoJSON.Feature<GeoJSON.Geometry, P>
		| GeoJSON.Geometry
		| string;

	type MapFillPaint = NonNullable<MapLibreGL.FillLayerSpecification["paint"]>;
	type MapLinePaint = NonNullable<MapLibreGL.LineLayerSpecification["paint"]>;

	export type MapGeoJSONFeature<P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties> =
		Omit<MapLibreGL.MapGeoJSONFeature, "properties"> & { properties: P };

	export type MapGeoJSONEvent<P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties> = {
		feature: MapGeoJSONFeature<P>;
		longitude: number;
		latitude: number;
		originalEvent: MapLibreGL.MapLayerMouseEvent;
	};

	export type MapGeoJSONProps<P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties> = {
		data: MapGeoJSONData<P>;
		id?: string;
		promoteId?: string;
		fillPaint?: MapFillPaint | false;
		linePaint?: MapLinePaint | false;
		fillHoverPaint?: MapFillPaint;
		onclick?: (e: MapGeoJSONEvent<P>) => void;
		onhover?: (e: MapGeoJSONEvent<P> | null) => void;
		interactive?: boolean;
		beforeId?: string;
	};
</script>

<script lang="ts" generics="P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties">
	import { useMap } from "./use-map.svelte.js";
	import { untrack } from "svelte";

	let {
		data,
		id: propId,
		promoteId,
		fillPaint,
		linePaint,
		fillHoverPaint,
		onclick,
		onhover,
		interactive = false,
		beforeId,
	}: MapGeoJSONProps<P> = $props();

	const GEOJSON_DEFAULT_COLORS = {
		light: { fill: "#d4d4d4", line: "#fafafa" },
		dark: { fill: "#404040", line: "#0a0a0a" },
	} satisfies Record<"light" | "dark", { fill: string; line: string }>;

	let autoId = $state(Math.random().toString(36).slice(2));
	const id = $derived(propId ?? autoId);
	const sourceId = $derived(`geojson-source-${id}`);
	const fillLayerId = $derived(`geojson-fill-${id}`);
	const lineLayerId = $derived(`geojson-line-${id}`);

	const mapCtx = useMap();
	const defaults = $derived(GEOJSON_DEFAULT_COLORS[mapCtx.resolvedTheme]);
	const showFill = $derived(fillPaint !== false);
	const showLine = $derived(linePaint !== false);

	function mergeHoverPaint<T extends Record<string, unknown>>(
		paint: T,
		hoverPaint: T | undefined
	): T {
		if (!hoverPaint) return paint;
		const merged: Record<string, unknown> = { ...paint };
		for (const [key, hoverValue] of Object.entries(hoverPaint)) {
			if (hoverValue === undefined) continue;
			const baseValue = merged[key];
			merged[key] =
				baseValue === undefined
					? hoverValue
					: ["case", ["boolean", ["feature-state", "hover"], false], hoverValue, baseValue];
		}
		return merged as T;
	}

	const mergedFillPaint = $derived(
		mergeHoverPaint({ "fill-color": defaults.fill, ...(fillPaint || {}) }, fillHoverPaint)
	);
	const mergedLinePaint = $derived({
		"line-color": defaults.line,
		"line-width": 0.5,
		...(linePaint || {}),
	});

	let hoveredId: string | number | null = null;

	function setHover(next: string | number | null) {
		const map = mapCtx.map;
		if (!map || next === hoveredId) return;
		const sourceExists = !!map.getSource(sourceId);
		if (hoveredId != null && sourceExists) {
			map.setFeatureState({ source: sourceId, id: hoveredId }, { hover: false });
		}
		hoveredId = next;
		if (next != null && sourceExists) {
			map.setFeatureState({ source: sourceId, id: next }, { hover: true });
		}
	}

	$effect(() => {
		const map = mapCtx.map;
		const isLoaded = mapCtx.isLoaded;
		if (!isLoaded || !map) return;

		const initialData = untrack(() => data);
		const initialPromoteId = untrack(() => promoteId);

		map.addSource(sourceId, {
			type: "geojson",
			data: initialData,
			...(initialPromoteId ? { promoteId: initialPromoteId } : {}),
		});

		return () => {
			try {
				if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
				if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
				if (map.getSource(sourceId)) map.removeSource(sourceId);
			} catch {
				// The style may be mid-reload.
			}
		};
	});

	$effect(() => {
		const map = mapCtx.map;
		const isLoaded = mapCtx.isLoaded;
		if (!isLoaded || !map) return;
		const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource | undefined;
		source?.setData(data as GeoJSON.GeoJSON | string);
	});

	$effect(() => {
		const map = mapCtx.map;
		const isLoaded = mapCtx.isLoaded;
		if (!isLoaded || !map) return;
		if (!map.getSource(sourceId)) return;

		if (showFill && !map.getLayer(fillLayerId)) {
			map.addLayer(
				{
					id: fillLayerId,
					type: "fill",
					source: sourceId,
					paint: mergedFillPaint,
				},
				beforeId
			);
		} else if (!showFill && map.getLayer(fillLayerId)) {
			map.removeLayer(fillLayerId);
		}

		if (showLine && !map.getLayer(lineLayerId)) {
			map.addLayer(
				{
					id: lineLayerId,
					type: "line",
					source: sourceId,
					paint: mergedLinePaint,
				},
				beforeId
			);
		} else if (!showLine && map.getLayer(lineLayerId)) {
			map.removeLayer(lineLayerId);
		}

		if (showFill && map.getLayer(fillLayerId)) {
			for (const [key, value] of Object.entries(mergedFillPaint)) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				map.setPaintProperty(fillLayerId, key as any, value);
			}
		}
		if (showLine && map.getLayer(lineLayerId)) {
			for (const [key, value] of Object.entries(mergedLinePaint)) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				map.setPaintProperty(lineLayerId, key as any, value);
			}
		}
	});

	$effect(() => {
		const map = mapCtx.map;
		const isLoaded = mapCtx.isLoaded;
		if (!isLoaded || !map || !interactive || !showFill) return;

		const handleMouseMove = (e: MapLibreGL.MapLayerMouseEvent) => {
			const feature = e.features?.[0];
			if (!feature) return;
			map.getCanvas().style.cursor = "pointer";

			const featureId = feature.id;
			if (featureId === hoveredId) return;
			setHover(featureId ?? null);
			onhover?.({
				feature: feature as unknown as MapGeoJSONFeature<P>,
				longitude: e.lngLat.lng,
				latitude: e.lngLat.lat,
				originalEvent: e,
			});
		};

		const handleMouseLeave = () => {
			setHover(null);
			map.getCanvas().style.cursor = "";
			onhover?.(null);
		};

		const handleClick = (e: MapLibreGL.MapLayerMouseEvent) => {
			const feature = e.features?.[0];
			if (!feature) return;
			onclick?.({
				feature: feature as unknown as MapGeoJSONFeature<P>,
				longitude: e.lngLat.lng,
				latitude: e.lngLat.lat,
				originalEvent: e,
			});
		};

		map.on("mousemove", fillLayerId, handleMouseMove);
		map.on("mouseleave", fillLayerId, handleMouseLeave);
		map.on("click", fillLayerId, handleClick);

		return () => {
			map.off("mousemove", fillLayerId, handleMouseMove);
			map.off("mouseleave", fillLayerId, handleMouseLeave);
			map.off("click", fillLayerId, handleClick);
			setHover(null);
			map.getCanvas().style.cursor = "";
		};
	});
</script>
