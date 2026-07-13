<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import { ComponentPreview } from "$lib/components/docs/preview";
	import GeoJSONExample from "$lib/components/docs/preview/examples/GeoJSONExample.svelte";
	import MapOverlayExample from "$lib/components/docs/preview/examples/MapOverlayExample.svelte";
	import { page } from "$app/state";

	const geojsonSource = $derived(page.data.geojsonSource);
	const geojsonHighlighted = $derived(page.data.geojsonHighlighted);
	const overlaySource = $derived(page.data.overlaySource);
	const overlayHighlighted = $derived(page.data.overlayHighlighted);
</script>

<svelte:head>
	<title>GeoJSON - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="GeoJSON"
	description="Render arbitrary GeoJSON as fill and outline layers for choropleths and region maps."
	pathname="/docs/geojson"
	prev={{ title: "Arcs", href: "/docs/arcs" }}
	next={{ title: "Clusters", href: "/docs/clusters" }}
>
	<DocsSection>
		<p>
			Use <DocsCode>MapGeoJSON</DocsCode> to draw polygons, lines, and points from a GeoJSON source as
			themed fill and outline layers.
		</p>
	</DocsSection>

	<DocsSection title="Basic GeoJSON">
		<p>
			Point <DocsCode>data</DocsCode> at a GeoJSON URL and the layer renders with a theme-aware monochrome
			fill and hairline outline out of the box. Here it loads a world map onto a <DocsCode
				>blank</DocsCode
			> map.
		</p>
		<ComponentPreview code={geojsonSource} highlightedCode={geojsonHighlighted}>
			<GeoJSONExample />
		</ComponentPreview>
	</DocsSection>

	<DocsSection title="Overlay on a Map">
		<p>Overlay shapes and regions on a map to highlight an area or trace a boundary.</p>
		<ComponentPreview code={overlaySource} highlightedCode={overlayHighlighted}>
			<MapOverlayExample />
		</ComponentPreview>
	</DocsSection>
</DocsLayout>
