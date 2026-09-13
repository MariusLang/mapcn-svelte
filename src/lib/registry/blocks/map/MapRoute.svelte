<script lang="ts">
	import { getContext, setContext, untrack, type Snippet } from "svelte";
	import * as MapLibreGL from "maplibre-gl";
	import { ROUTE_CONTEXT, type RouteContext } from "./route-context.js";
	import {
		measureRoute,
		pointAtFraction,
		sliceAtFraction,
		resolveBeforeId,
		createRouteRaiser,
	} from "./route.js";

	interface Props {
		/** Optional unique identifier for the route layer */
		id?: string;
		/** Array of [longitude, latitude] coordinate pairs defining the route */
		coordinates: [number, number][];
		/** Line color as CSS color value (default: "#4285F4") */
		color?: string;
		/** Line width in pixels (default: 3) */
		width?: number;
		/** Line opacity from 0 to 1 (default: 0.8) */
		opacity?: number;
		/** Dash pattern [dash length, gap length] for dashed lines */
		dashArray?: [number, number];
		/** Fraction traveled, from 0 to 1. Drives RouteProgress and RouteMarker. */
		progress?: number;
		/** Raise this route above siblings and apply the active styles. */
		active?: boolean;
		activeColor?: string;
		activeWidth?: number;
		activeOpacity?: number;
		activeDashArray?: [number, number];
		/** Insert the route and its child layers below this MapLibre layer. */
		beforeId?: string;
		children?: Snippet;
		/** Callback when the route line is clicked */
		onclick?: () => void;
		/** Callback when mouse enters the route line */
		onmouseenter?: () => void;
		/** Callback when mouse leaves the route line */
		onmouseleave?: () => void;
		/** Whether the route is interactive - shows pointer cursor on hover (default: true) */
		interactive?: boolean;
	}

	let {
		coordinates,
		color = "#4285F4",
		width = 3,
		opacity = 0.8,
		dashArray,
		progress,
		active = false,
		activeColor,
		activeWidth,
		activeOpacity,
		activeDashArray,
		beforeId,
		children,
		onclick,
		onmouseenter,
		onmouseleave,
		interactive = true,
		id = crypto.randomUUID(),
	}: Props = $props();

	const mapCtx = getContext<{
		getMap: () => MapLibreGL.Map | null;
		isStyleReady: () => boolean;
	}>("map");

	const sourceId = $derived(`route-source-${id}`);
	const layerId = $derived(`route-layer-${id}`);
	let ready = $state(false);
	const resolvedColor = $derived(active ? (activeColor ?? color) : color);
	const resolvedWidth = $derived(active ? (activeWidth ?? width) : width);
	const resolvedOpacity = $derived(active ? (activeOpacity ?? opacity) : opacity);
	const resolvedDashArray = $derived(active ? (activeDashArray ?? dashArray) : dashArray);
	const measure = $derived(measureRoute(coordinates));
	const traveled = $derived(
		progress === undefined ? [] : sliceAtFraction(coordinates, measure, progress)
	);
	let childLayers: string[] = [];
	setContext<RouteContext>(ROUTE_CONTEXT, {
		get id() {
			return id;
		},
		get ready() {
			return ready;
		},
		get coordinates() {
			return coordinates;
		},
		get traveled() {
			return traveled;
		},
		get progress() {
			return progress;
		},
		get color() {
			return resolvedColor;
		},
		get width() {
			return resolvedWidth;
		},
		get opacity() {
			return resolvedOpacity;
		},
		get dashArray() {
			return resolvedDashArray;
		},
		get beforeId() {
			return beforeId;
		},
		pointAt(at) {
			if (!coordinates.length) return null;
			if (at === "start") return coordinates[0];
			if (at === "end") return coordinates[coordinates.length - 1];
			if (at === "progress" && progress === undefined) return null;
			return pointAtFraction(coordinates, measure, at === "progress" ? progress! : at);
		},
		registerLayer(id) {
			childLayers.push(id);
			return () => {
				childLayers = childLayers.filter((entry) => entry !== id);
			};
		},
	});

	// Add route when map is ready
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isStyleReady();
		const initialCoordinates = untrack(() => coordinates);
		const initialColor = untrack(() => resolvedColor);
		const initialWidth = untrack(() => resolvedWidth);
		const initialOpacity = untrack(() => resolvedOpacity);
		const initialDashArray = untrack(() => resolvedDashArray);
		const currentSourceId = sourceId;
		const currentLayerId = layerId;

		if (!loaded || !map) return;

		// Add source
		map.addSource(sourceId, {
			type: "geojson",
			data: {
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: initialCoordinates.length < 2 ? [] : initialCoordinates,
				},
			},
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const paint: any = {
			"line-color": initialColor,
			"line-width": initialWidth,
			"line-opacity": initialOpacity,
			"line-color-transition": { duration: 300, delay: 0 },
			"line-width-transition": { duration: 300, delay: 0 },
			"line-opacity-transition": { duration: 300, delay: 0 },
		};

		if (initialDashArray) {
			paint["line-dasharray"] = initialDashArray;
		}

		// Add layer
		map.addLayer(
			{
				id: layerId,
				type: "line",
				source: sourceId,
				layout: {
					"line-join": "round",
					"line-cap": "round",
				},
				paint,
			},
			resolveBeforeId(map, beforeId)
		);
		ready = true;

		return () => {
			ready = false;
			try {
				if (map.getLayer(currentLayerId)) map.removeLayer(currentLayerId);
				if (map.getSource(currentSourceId)) map.removeSource(currentSourceId);
			} catch {
				// Ignore errors during cleanup
			}
		};
	});

	// Update route data when coordinates change
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isStyleReady();

		if (!loaded || !map) return;

		const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource | undefined;
		if (source) {
			source.setData({
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: coordinates.length < 2 ? [] : coordinates,
				},
			});
		}
	});

	// Update paint properties when they change
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isStyleReady();

		if (!loaded || !map || !map.getLayer(layerId)) return;

		map.setPaintProperty(layerId, "line-color", resolvedColor);
		map.setPaintProperty(layerId, "line-width", resolvedWidth);
		map.setPaintProperty(layerId, "line-opacity", resolvedOpacity);
		map.setPaintProperty(layerId, "line-dasharray", resolvedDashArray);
	});

	// React to layer membership, not order: moveLayer itself fires styledata.
	$effect(() => {
		const map = mapCtx.getMap();
		if (!ready || !map || !active) return;
		const baseLayer = layerId;
		const boundary = beforeId;
		const raise = createRouteRaiser(map, () => [baseLayer, ...childLayers], boundary);
		raise();
		map.on("styledata", raise);
		return () => {
			map.off("styledata", raise);
		};
	});

	// Handle click and hover events
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isStyleReady();

		if (!loaded || !map || !interactive) return;

		const handleClick = () => {
			onclick?.();
		};
		const handleMouseEnter = () => {
			map.getCanvas().style.cursor = "pointer";
			onmouseenter?.();
		};
		const handleMouseLeave = () => {
			map.getCanvas().style.cursor = "";
			onmouseleave?.();
		};

		map.on("click", layerId, handleClick);
		map.on("mouseenter", layerId, handleMouseEnter);
		map.on("mouseleave", layerId, handleMouseLeave);

		return () => {
			map.off("click", layerId, handleClick);
			map.off("mouseenter", layerId, handleMouseEnter);
			map.off("mouseleave", layerId, handleMouseLeave);
			map.getCanvas().style.cursor = "";
		};
	});
</script>

{@render children?.()}
