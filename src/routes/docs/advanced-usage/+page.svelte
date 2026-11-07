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

	const advancedUsageFiles = $derived(page.data.advancedUsageFiles);
	const customLayerFiles = $derived(page.data.customLayerFiles);
	const layerMarkersSource = $derived(page.data.layerMarkersSource);
	const layerMarkersHighlighted = $derived(page.data.layerMarkersHighlighted);

	const refCode = `<script lang="ts">
  import { Map } from "$lib/components/ui/map";
  import type { Map as MapInstance } from "maplibre-gl";

  let map = $state<MapInstance | null>(null);
<\/script>

<button type="button" onclick={() => map?.flyTo({ center: [-74, 40.7], zoom: 12 })}>
  Fly to NYC
</button>
<div class="h-[400px]">
  <Map bind:map center={[-74, 40.7]} zoom={10} />
</div>`;

	const useMapCode = `<!-- MapEventListener.svelte -->
<script lang="ts">
  import { useMap } from "$lib/components/ui/map";
  import type { MapMouseEvent } from "maplibre-gl";

  const context = useMap();

  $effect(() => {
    const map = context.map;
    if (!map || !context.isLoaded) return;

    const handleClick = (event: MapMouseEvent) => {
      console.log("Clicked at:", event.lngLat);
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  });
<\/script>`;
</script>

<svelte:head>
	<title>Advanced - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="Advanced"
	description="Access the underlying MapLibre GL instance for advanced customization."
	pathname="/docs/advanced-usage"
>
	<DocsSection>
		<p>
			Access the underlying MapLibre GL map instance to use any feature from the MapLibre GL JS API.
			Use <DocsCode>bind:map</DocsCode> from a parent component or <DocsCode>useMap</DocsCode> from a
			child.
		</p>
	</DocsSection>

	<DocsNote>
		<strong>Tip:</strong> Check the
		<DocsLink href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/" external>
			MapLibre GL JS documentation
		</DocsLink>
		for the full list of available methods and events.
	</DocsNote>

	<DocsSection title="Using a Ref">
		<p>
			Use <DocsCode>bind:map</DocsCode> to call MapLibre methods from a parent component’s event handlers
			or effects.
		</p>
		<CodeBlock code={refCode} language="svelte" />
	</DocsSection>

	<DocsSection title="Using the Hook">
		<p>
			For a child component rendered inside <DocsCode>Map</DocsCode>, use
			<DocsCode>useMap()</DocsCode> to access the map and listen for events.
		</p>
		<CodeBlock code={useMapCode} language="svelte" />
	</DocsSection>

	<DocsSection title="Example: Custom Controls">
		<p>
			This example shows how to create custom controls that manipulate the map's pitch and bearing,
			and listen to map events to display real-time values.
		</p>
		<ComponentPreview files={advancedUsageFiles}>
			<AdvancedUsageExample />
		</ComponentPreview>
	</DocsSection>

	<DocsSection title="Example: Custom GeoJSON Layer">
		<p>
			Add custom GeoJSON data as layers with fill and outline styles. This example shows NYC parks
			with hover interactions.
		</p>
		<ComponentPreview files={customLayerFiles}>
			<CustomLayerExample />
		</ComponentPreview>
	</DocsSection>

	<DocsSection title="Example: Markers via Layers">
		<p>
			When displaying hundreds or thousands of markers, use GeoJSON layers instead of DOM-based
			<DocsCode>MapMarker</DocsCode> components. This approach renders markers on the WebGL canvas, providing
			significantly better performance.
		</p>
		<ComponentPreview code={layerMarkersSource} highlightedCode={layerMarkersHighlighted}>
			<LayerMarkersExample />
		</ComponentPreview>
	</DocsSection>

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
