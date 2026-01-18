<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import DocsLink from "$lib/components/docs/DocsLink.svelte";
	import DocsNote from "$lib/components/docs/DocsNote.svelte";
	import { ComponentPreview } from "$lib/components/docs/preview";
	import CodeBlock from "$lib/components/docs/preview/CodeBlock.svelte";
	import AdvancedUsageExample from "$lib/components/docs/preview/examples/AdvancedUsageExample.svelte";
	import CustomLayerExample from "$lib/components/docs/preview/examples/CustomLayerExample.svelte";
	import LayerMarkersExample from "$lib/components/docs/preview/examples/LayerMarkersExample.svelte";
	import { page } from "$app/state";

	const advancedUsageSource = $derived(page.data.advancedUsageSource);
	const advancedUsageHighlighted = $derived(page.data.advancedUsageHighlighted);

	const customLayerSource = $derived(page.data.customLayerSource);
	const customLayerHighlighted = $derived(page.data.customLayerHighlighted);

	const layerMarkersSource = $derived(page.data.layerMarkersSource);
	const layerMarkersHighlighted = $derived(page.data.layerMarkersHighlighted);

	const useContextCode = `<script lang="ts">
	import { Map } from "$lib/components/ui/map";
	import MapLibreGL from "maplibre-gl";
	import { getContext } from "svelte";
	import { onMount } from "svelte";

	// For child components inside Map, use getContext
	function MapEventListener() {
		const mapCtx = getContext<{
			getMap: () => MapLibreGL.Map | null;
			isLoaded: () => boolean;
		}>("map");

		onMount(() => {
			const map = mapCtx.getMap();
			if (!map || !mapCtx.isLoaded()) return;

			const handleClick = (e: MapLibreGL.MapMouseEvent) => {
				console.log("Clicked at:", e.lngLat);
			};

			map.on("click", handleClick);
			return () => map.off("click", handleClick);
		});

		return null;
	}

	// Usage
	<Map center={[-74, 40.7]} zoom={10}>
		<MapEventListener />
	</Map>
<\/script>`; // eslint-disable-line no-useless-escape
</script>

<svelte:head>
	<title>Advanced - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="Advanced"
	description="Access the underlying MapLibre GL instance for advanced customization."
	prev={{ title: "Clusters", href: "/docs/clusters" }}
>
	<DocsSection>
		<p>
			Access the underlying MapLibre GL map instance to use any feature from the MapLibre GL JS API.
			You can use <DocsCode>getContext</DocsCode> in child components to access the map instance.
		</p>
	</DocsSection>

	<DocsNote>
		<strong>Tip:</strong> Check the
		<DocsLink href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/" external>
			MapLibre GL JS documentation
		</DocsLink>
		for the full list of available methods and events.
	</DocsNote>

	<DocsSection title="Using Context">
		<p>
			For child components rendered inside <DocsCode>Map</DocsCode>, use
			<DocsCode>getContext("map")</DocsCode> to access the map instance and listen to events.
		</p>
		<CodeBlock code={useContextCode} language="typescript" />
	</DocsSection>

	<DocsSection title="Listening to Map Events">
		<p>
			Use <DocsCode>onMount</DocsCode> with <DocsCode>getContext</DocsCode> to set up event listeners
			in child components.
		</p>
		<CodeBlock code={useContextCode} language="typescript" />
	</DocsSection>

	<DocsSection title="Example: Custom Controls">
		<p>
			This example shows how to create custom controls that manipulate the map's pitch and bearing,
			and listen to map events to display real-time values.
		</p>
	</DocsSection>

	<ComponentPreview code={advancedUsageSource} highlightedCode={advancedUsageHighlighted}>
		<AdvancedUsageExample />
	</ComponentPreview>

	<DocsSection title="Example: Custom GeoJSON Layer">
		<p>
			Add custom GeoJSON data as layers with fill and outline styles. This example shows NYC parks
			with hover interactions.
		</p>
	</DocsSection>

	<ComponentPreview code={customLayerSource} highlightedCode={customLayerHighlighted}>
		<CustomLayerExample />
	</ComponentPreview>

	<DocsSection title="Example: Markers via Layers">
		<p>
			When displaying hundreds or thousands of markers, use GeoJSON layers instead of DOM-based
			<DocsCode>MapMarker</DocsCode> components. This approach renders markers on the WebGL canvas, providing
			significantly better performance.
		</p>
	</DocsSection>

	<ComponentPreview code={layerMarkersSource} highlightedCode={layerMarkersHighlighted}>
		<LayerMarkersExample />
	</ComponentPreview>

	<DocsSection title="Extend to Build">
		<p>You can extend this to build custom features like:</p>
		<ul>
			<li>
				<strong>Real-time tracking</strong> - Live location updates for delivery, rides, or fleet management
			</li>
			<li>
				<strong>Geofencing</strong> - Trigger actions when users enter or leave specific areas
			</li>
			<li>
				<strong>Heatmaps</strong> - Visualize density data like population, crime, or activity hotspots
			</li>
			<li>
				<strong>Drawing tools</strong> - Let users draw polygons, lines, or place markers for custom areas
			</li>
			<li>
				<strong>3D buildings</strong> - Extrude building footprints for urban visualization
			</li>
			<li>
				<strong>Animations</strong> - Animate markers along routes or create fly-through experiences
			</li>
			<li>
				<strong>Custom data layers</strong> - Overlay weather, traffic, or satellite imagery
			</li>
		</ul>
	</DocsSection>
</DocsLayout>
