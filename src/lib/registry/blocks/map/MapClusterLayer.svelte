<script lang="ts" generics="P extends GeoJSON.GeoJsonProperties">
	import { getContext } from "svelte";
	import MapLibreGL from "maplibre-gl";

	interface Props {
		/** GeoJSON FeatureCollection data or URL to fetch GeoJSON from */
		data: string | GeoJSON.FeatureCollection<GeoJSON.Point, P>;
		/** Maximum zoom level to cluster points on (default: 14) */
		clusterMaxZoom?: number;
		/** Radius of each cluster when clustering points in pixels (default: 50) */
		clusterRadius?: number;
		/** Colors for cluster circles: [small, medium, large] based on point count (default: ["#51bbd6", "#f1f075", "#f28cb1"]) */
		clusterColors?: [string, string, string];
		/** Point count thresholds for color/size steps: [medium, large] (default: [100, 750]) */
		clusterThresholds?: [number, number];
		/** Color for unclustered individual points (default: "#3b82f6") */
		pointColor?: string;
		/** Callback when an unclustered point is clicked */
		onpointclick?: (
			feature: GeoJSON.Feature<GeoJSON.Point, P>,
			coordinates: [number, number]
		) => void;
		/** Callback when a cluster is clicked. If not provided, zooms into the cluster */
		onclusterclick?: (clusterId: number, coordinates: [number, number], pointCount: number) => void;
	}

	let {
		data,
		clusterMaxZoom = 14,
		clusterRadius = 50,
		clusterColors = ["#51bbd6", "#f1f075", "#f28cb1"],
		clusterThresholds = [100, 750],
		pointColor = "#3b82f6",
		onpointclick,
		onclusterclick,
	}: Props = $props();

	const mapCtx = getContext<{
		getMap: () => MapLibreGL.Map | null;
		isLoaded: () => boolean;
	}>("map");

	const id = crypto.randomUUID();
	const sourceId = $derived(`cluster-source-${id}`);
	const clusterLayerId = $derived(`clusters-${id}`);
	const clusterCountLayerId = $derived(`cluster-count-${id}`);
	const unclusteredLayerId = $derived(`unclustered-point-${id}`);

	const styleProps = $derived({
		clusterColors,
		clusterThresholds,
		pointColor,
	});

	// Add source and layers when map is ready
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isLoaded();

		if (!loaded || !map) return;

		// Remove existing layers and source if they exist
		try {
			if (map.getLayer(clusterCountLayerId)) map.removeLayer(clusterCountLayerId);
			if (map.getLayer(unclusteredLayerId)) map.removeLayer(unclusteredLayerId);
			if (map.getLayer(clusterLayerId)) map.removeLayer(clusterLayerId);
			if (map.getSource(sourceId)) map.removeSource(sourceId);
		} catch {
			// ignore
		}

		// Add clustered GeoJSON source
		map.addSource(sourceId, {
			type: "geojson",
			data,
			cluster: true,
			clusterMaxZoom,
			clusterRadius,
		});

		// Add cluster circles layer
		map.addLayer({
			id: clusterLayerId,
			type: "circle",
			source: sourceId,
			filter: ["has", "point_count"],
			paint: {
				"circle-color": [
					"step",
					["get", "point_count"],
					clusterColors[0],
					clusterThresholds[0],
					clusterColors[1],
					clusterThresholds[1],
					clusterColors[2],
				],
				"circle-radius": [
					"step",
					["get", "point_count"],
					20,
					clusterThresholds[0],
					30,
					clusterThresholds[1],
					40,
				],
			},
		});

		// Add cluster count text layer
		map.addLayer({
			id: clusterCountLayerId,
			type: "symbol",
			source: sourceId,
			filter: ["has", "point_count"],
			layout: {
				"text-field": "{point_count_abbreviated}",
				"text-size": 12,
			},
			paint: {
				"text-color": "#fff",
			},
		});

		// Add unclustered point layer
		map.addLayer({
			id: unclusteredLayerId,
			type: "circle",
			source: sourceId,
			filter: ["!", ["has", "point_count"]],
			paint: {
				"circle-color": pointColor,
				"circle-radius": 6,
			},
		});

		return () => {
			try {
				if (map.getLayer(clusterCountLayerId)) map.removeLayer(clusterCountLayerId);
				if (map.getLayer(unclusteredLayerId)) map.removeLayer(unclusteredLayerId);
				if (map.getLayer(clusterLayerId)) map.removeLayer(clusterLayerId);
				if (map.getSource(sourceId)) map.removeSource(sourceId);
			} catch {
				// ignore
			}
		};
	});

	// Update source data when data prop changes (only for non-URL data)
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isLoaded();

		if (!loaded || !map || typeof data === "string") return;

		const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource | undefined;
		if (source) {
			source.setData(data);
		}
	});

	// Update layer styles when props change
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isLoaded();

		if (!loaded || !map) return;

		const prev = styleProps;
		const colorsChanged =
			prev.clusterColors !== clusterColors || prev.clusterThresholds !== clusterThresholds;

		// Update cluster layer colors and sizes
		if (map.getLayer(clusterLayerId) && colorsChanged) {
			map.setPaintProperty(clusterLayerId, "circle-color", [
				"step",
				["get", "point_count"],
				clusterColors[0],
				clusterThresholds[0],
				clusterColors[1],
				clusterThresholds[1],
				clusterColors[2],
			]);
			map.setPaintProperty(clusterLayerId, "circle-radius", [
				"step",
				["get", "point_count"],
				20,
				clusterThresholds[0],
				30,
				clusterThresholds[1],
				40,
			]);
		}

		// Update unclustered point layer color
		if (map.getLayer(unclusteredLayerId) && prev.pointColor !== pointColor) {
			map.setPaintProperty(unclusteredLayerId, "circle-color", pointColor);
		}
	});

	// Handle click events
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isLoaded();

		if (!loaded || !map) return;

		// Cluster click handler - zoom into cluster
		const handleClusterClick = async (
			e: MapLibreGL.MapMouseEvent & {
				features?: MapLibreGL.MapGeoJSONFeature[];
			}
		) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: [clusterLayerId],
			});
			if (!features.length) return;

			const feature = features[0];
			const clusterId = feature.properties?.cluster_id as number;
			const pointCount = feature.properties?.point_count as number;
			const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [number, number];

			if (onclusterclick) {
				onclusterclick(clusterId, coordinates, pointCount);
			} else {
				// Default behavior: zoom to cluster expansion zoom
				const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
				const zoom = await source.getClusterExpansionZoom(clusterId);
				map.easeTo({
					center: coordinates,
					zoom,
				});
			}
		};

		// Unclustered point click handler
		const handlePointClick = (
			e: MapLibreGL.MapMouseEvent & {
				features?: MapLibreGL.MapGeoJSONFeature[];
			}
		) => {
			if (!onpointclick || !e.features?.length) return;

			const feature = e.features[0];
			const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice() as [
				number,
				number,
			];

			// Handle world copies
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}

			onpointclick(feature as unknown as GeoJSON.Feature<GeoJSON.Point, P>, coordinates);
		};

		// Cursor style handlers
		const handleMouseEnterCluster = () => {
			map.getCanvas().style.cursor = "pointer";
		};
		const handleMouseLeaveCluster = () => {
			map.getCanvas().style.cursor = "";
		};
		const handleMouseEnterPoint = () => {
			if (onpointclick) {
				map.getCanvas().style.cursor = "pointer";
			}
		};
		const handleMouseLeavePoint = () => {
			map.getCanvas().style.cursor = "";
		};

		map.on("click", clusterLayerId, handleClusterClick);
		map.on("click", unclusteredLayerId, handlePointClick);
		map.on("mouseenter", clusterLayerId, handleMouseEnterCluster);
		map.on("mouseleave", clusterLayerId, handleMouseLeaveCluster);
		map.on("mouseenter", unclusteredLayerId, handleMouseEnterPoint);
		map.on("mouseleave", unclusteredLayerId, handleMouseLeavePoint);

		return () => {
			map.off("click", clusterLayerId, handleClusterClick);
			map.off("click", unclusteredLayerId, handlePointClick);
			map.off("mouseenter", clusterLayerId, handleMouseEnterCluster);
			map.off("mouseleave", clusterLayerId, handleMouseLeaveCluster);
			map.off("mouseenter", unclusteredLayerId, handleMouseEnterPoint);
			map.off("mouseleave", unclusteredLayerId, handleMouseLeavePoint);
		};
	});
</script>
