<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsNote from "$lib/components/docs/DocsNote.svelte";
	import DocsLink from "$lib/components/docs/DocsLink.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import { CodeBlock } from "$lib/components/docs/preview";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import DocsPropTable from "$lib/components/docs/DocsPropTable.svelte";

	const anatomyCode = `<Map>
  <MapMarker longitude={...} latitude={...}>
    <MarkerContent>
      <MarkerLabel />
    </MarkerContent>
    <MarkerPopup />
    <MarkerTooltip />
  </MapMarker>

  <MapPopup longitude={...} latitude={...} />
  <MapControls />
  <MapRoute coordinates={...} />
</Map>`;

	const useMapCode =
		`<scr` +
		`ipt lang="ts">
  import { getContext } from "svelte";
  import type MapLibreGL from "maplibre-gl";

  const mapCtx = getContext<{
    getMap: () => MapLibreGL.Map | null;
    isLoaded: () => boolean;
  }>("map");

  // Access the map instance
  const map = mapCtx.getMap();
  const isLoaded = mapCtx.isLoaded();
</scr` +
		`ipt>`;
</script>

<svelte:head>
	<title>API Reference - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="API Reference"
	description="Complete reference for all map components and their props."
	prev={{ title: "Installation", href: "/docs/installation" }}
	next={{ title: "Map", href: "/docs/basic-map" }}
>
	<DocsNote>
		<strong>Note:</strong> This library is built on top of
		<DocsLink href="https://maplibre.org/maplibre-gl-js/docs/API/" external>
			MapLibre GL JS
		</DocsLink>
		. Most components extend the native MapLibre options. Refer to the
		<DocsLink href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/" external>
			MapLibre Map API
		</DocsLink>
		for additional options not listed here.
	</DocsNote>

	<DocsSection title="Component Anatomy">
		<p>All parts of the component that you can use and combine to build your map.</p>

		<CodeBlock code={anatomyCode} showCopyButton={false} />
	</DocsSection>

	<!-- Map -->
	<DocsSection title="Map">
		<p>
			The root container component that initializes MapLibre GL and provides context to child
			components. Automatically handles theme switching between light and dark modes.
		</p>

		<p>
			Extends
			<DocsLink
				href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/"
				external
			>
				MapOptions
			</DocsLink>
			from MapLibre GL (excluding
			<DocsCode>container</DocsCode>
			and
			<DocsCode>style</DocsCode>
			).
		</p>

		<DocsPropTable
			props={[
				{
					name: "children",
					type: "Snippet",
					description: "Child components (markers, popups, controls, routes).",
				},
				{
					name: "styles",
					type: "{ light?: string | StyleSpecification; dark?: string | StyleSpecification }",
					description: "Custom map styles for light and dark themes.",
				},
			]}
		/>
	</DocsSection>

	<!-- Map Context -->
	<DocsSection title="Map Context">
		<p>
			Access the MapLibre map instance and loading state via Svelte context. Must be used within a
			<DocsCode>Map</DocsCode>
			component.
		</p>

		<CodeBlock code={useMapCode} language="svelte" showCopyButton={false} />

		<p>
			Provides
			<DocsCode>getMap()</DocsCode>
			returning the
			<DocsLink href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/" external>
				MapLibre.Map
			</DocsLink>
			instance, and
			<DocsCode>isLoaded()</DocsCode>
			returning a boolean.
		</p>
	</DocsSection>

	<!-- MapControls -->
	<DocsSection title="MapControls">
		<p>
			Renders map control buttons (zoom, compass, locate, fullscreen). Must be used inside
			<DocsCode>Map</DocsCode>
			.
		</p>

		<DocsPropTable
			props={[
				{
					name: "position",
					type: '"top-left" | "top-right" | "bottom-left" | "bottom-right"',
					default: '"bottom-right"',
					description: "Position of the controls.",
				},
				{ name: "showZoom", type: "boolean", default: "true", description: "Show zoom buttons." },
				{
					name: "showCompass",
					type: "boolean",
					default: "false",
					description: "Show compass button.",
				},
				{
					name: "showLocate",
					type: "boolean",
					default: "false",
					description: "Show locate button.",
				},
				{
					name: "showFullscreen",
					type: "boolean",
					default: "false",
					description: "Show fullscreen button.",
				},
				{ name: "className", type: "string", description: "Additional CSS classes." },
				{
					name: "onLocate",
					type: "(coords: { longitude: number; latitude: number }) => void",
					description: "Called when user is located.",
				},
			]}
		/>
	</DocsSection>

	<!-- MapRoute -->
	<DocsSection title="MapRoute">
		<p>
			Renders a line on the map connecting coordinate points. Must be used inside
			<DocsCode>Map</DocsCode>
			.
		</p>

		<DocsPropTable
			props={[
				{
					name: "coordinates",
					type: "[number, number][]",
					description: "Array of [lng, lat] pairs.",
				},
				{ name: "color", type: "string", default: '"#4285F4"', description: "Line color." },
				{ name: "width", type: "number", default: "3", description: "Line width." },
				{ name: "opacity", type: "number", default: "0.8", description: "Line opacity." },
				{
					name: "dashArray",
					type: "[number, number]",
					description: "Dash pattern for dashed lines.",
				},
			]}
		/>
	</DocsSection>
</DocsLayout>
