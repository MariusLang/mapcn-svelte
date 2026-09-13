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
  <MapGeoJSON data={...} />
  <MapClusterLayer data={...} />
</Map>`;

	const useMapCode =
		`<scr` +
		`ipt lang="ts">
  import { getContext } from "svelte";
  import type * as MapLibreGL from "maplibre-gl";

  const mapCtx = getContext<{
    getMap: () => MapLibreGL.Map | null;
    isLoaded: () => boolean;
    isStyleReady: () => boolean;
    resolvedTheme: () => "light" | "dark";
  }>("map");

  // Access the map instance
  const map = mapCtx.getMap();
  const isLoaded = mapCtx.isLoaded();
  const resolvedTheme = mapCtx.resolvedTheme();
</scr` +
		`ipt>`;
</script>

<svelte:head>
	<title>API Reference - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="API Reference"
	description="Complete reference for all map components and their props."
	pathname="/docs/api-reference"
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
					name: "theme",
					type: '"light" | "dark"',
					description:
						"Force a fixed light or dark map style. If omitted, the map follows the document theme or system preference.",
				},
				{
					name: "styles",
					type: "{ light?: string | StyleSpecification; dark?: string | StyleSpecification }",
					description:
						"Custom map styles for light and dark themes. Overrides the default Carto base map tiles.",
				},
				{
					name: "blank",
					type: "boolean",
					default: "false",
					description:
						"Use a transparent tile-less basemap. Ignored when custom styles are provided.",
				},
				{
					name: "loading",
					type: "boolean",
					default: "false",
					description: "Show the loading indicator over the map.",
				},
				{
					name: "projection",
					type: "ProjectionSpecification",
					description: "Map projection type. Use { type: 'globe' } for 3D globe view.",
				},
			]}
		/>
	</DocsSection>

	<!-- Map Context -->
	<DocsSection title="Map Context">
		<p>
			A hook that provides access to the MapLibre map instance and loading state. Must be used
			within a
			<DocsCode>Map</DocsCode>
			component.
		</p>

		<CodeBlock code={useMapCode} language="svelte" showCopyButton={false} />

		<p>
			Provides
			<DocsCode>getMap()</DocsCode>
			returning
			<DocsLink href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/" external>
				MapLibre.Map
			</DocsLink>
			instance, and
			<DocsCode>isLoaded()</DocsCode>
			returning a boolean tells you if the map is loaded, plus
			<DocsCode>isStyleReady()</DocsCode>
			and
			<DocsCode>resolvedTheme()</DocsCode>
			for layer components that need style readiness or theme-aware paint.
		</p>
	</DocsSection>

	<DocsSection title="MapGeoJSON">
		<p>
			Renders GeoJSON data as fill and line layers. Use it inside a
			<DocsCode>Map</DocsCode>
			, often with the
			<DocsCode>blank</DocsCode>
			prop for choropleths and region maps. Accepts a generic type for feature properties. Defaults to
			a theme-aware monochrome fill and outline; any paint value can be a MapLibre expression.
		</p>

		<DocsPropTable
			props={[
				{
					name: "data",
					type: "FeatureCollection | Feature | Geometry | string",
					description: "GeoJSON object or URL to render.",
				},
				{
					name: "promoteId",
					type: "string",
					description: "Feature property promoted to id for hover state.",
				},
				{
					name: "fillPaint",
					type: "FillLayerSpecification['paint'] | false",
					description: "Fill layer paint. Pass false to omit the fill layer.",
				},
				{
					name: "linePaint",
					type: "LineLayerSpecification['paint'] | false",
					description: "Outline layer paint. Pass false to omit outlines.",
				},
				{
					name: "interactive",
					type: "boolean",
					default: "false",
					description: "Enable hover and click events on the fill layer.",
				},
			]}
		/>
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
					description: "Position of the controls on the map.",
				},
				{
					name: "showZoom",
					type: "boolean",
					default: "true",
					description: "Show zoom in/out buttons.",
				},
				{
					name: "showCompass",
					type: "boolean",
					default: "false",
					description: "Show compass button to reset bearing.",
				},
				{
					name: "showLocate",
					type: "boolean",
					default: "false",
					description: "Show locate button to find user's location.",
				},
				{
					name: "showFullscreen",
					type: "boolean",
					default: "false",
					description: "Show fullscreen toggle button.",
				},
				{
					name: "className",
					type: "string",
					description: "Additional CSS classes for the controls container.",
				},
				{
					name: "onLocate",
					type: "(coords: { longitude: number; latitude: number }) => void",
					description: "Callback with user coordinates when located.",
				},
			]}
		/>
	</DocsSection>

	<!-- MapMarker -->
	<DocsSection title="MapMarker">
		<p>
			A container for marker-related components. Provides context for its children and handles
			marker positioning.
		</p>

		<p>
			Extends
			<DocsLink
				href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MarkerOptions/"
				external
			>
				MarkerOptions
			</DocsLink>
			from MapLibre GL (excluding
			<DocsCode>element</DocsCode>
			).
		</p>

		<DocsPropTable
			props={[
				{
					name: "longitude",
					type: "number",
					description: "Longitude coordinate for marker position.",
				},
				{
					name: "latitude",
					type: "number",
					description: "Latitude coordinate for marker position.",
				},
				{
					name: "children",
					type: "Snippet",
					description: "Marker subcomponents (MarkerContent, MarkerPopup, etc).",
				},
				{
					name: "onClick",
					type: "(e: MouseEvent) => void",
					description: "Callback when marker is clicked.",
				},
				{
					name: "onMouseEnter",
					type: "(e: MouseEvent) => void",
					description: "Callback when mouse enters marker.",
				},
				{
					name: "onMouseLeave",
					type: "(e: MouseEvent) => void",
					description: "Callback when mouse leaves marker.",
				},
				{
					name: "onDragStart",
					type: "(lngLat: {lng, lat}) => void",
					description: "Callback when marker drag starts (requires draggable: true).",
				},
				{
					name: "onDrag",
					type: "(lngLat: {lng, lat}) => void",
					description: "Callback during marker drag (requires draggable: true).",
				},
				{
					name: "onDragEnd",
					type: "(lngLat: {lng, lat}) => void",
					description: "Callback when marker drag ends (requires draggable: true).",
				},
			]}
		/>
	</DocsSection>

	<!-- MarkerContent -->
	<DocsSection title="MarkerContent">
		<p>
			Renders the visual content of a marker. Must be used inside
			<DocsCode>MapMarker</DocsCode>
			. If no children provided, renders a default blue dot marker.
		</p>

		<DocsPropTable
			props={[
				{
					name: "children",
					type: "Snippet",
					description: "Custom marker content. Defaults to a blue dot.",
				},
				{
					name: "className",
					type: "string",
					description: "Additional CSS classes for the marker container.",
				},
			]}
		/>
	</DocsSection>

	<!-- MarkerPopup -->
	<DocsSection title="MarkerPopup">
		<p>
			Renders a popup attached to the marker that opens on click. Must be used inside
			<DocsCode>MapMarker</DocsCode>
			.
		</p>

		<p>
			Extends
			<DocsLink
				href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PopupOptions/"
				external
			>
				PopupOptions
			</DocsLink>
			from MapLibre GL (excluding
			<DocsCode>className</DocsCode>
			and
			<DocsCode>closeButton</DocsCode>
			).
		</p>

		<DocsNote>
			MapLibre&apos;s own
			<DocsCode>className</DocsCode>
			and
			<DocsCode>closeButton</DocsCode>
			options are excluded to prevent style conflicts. Use the component&apos;s props of the same name
			instead. MapLibre&apos;s default popup styles are reset via CSS.
		</DocsNote>

		<DocsPropTable
			props={[
				{
					name: "children",
					type: "Snippet",
					description: "Popup content.",
				},
				{
					name: "className",
					type: "string",
					description: "Additional CSS classes for the popup container.",
				},
				{
					name: "closeButton",
					type: "boolean",
					default: "false",
					description: "Show a close button in the popup.",
				},
			]}
		/>
	</DocsSection>

	<!-- MarkerTooltip -->
	<DocsSection title="MarkerTooltip">
		<p>
			Renders a tooltip that appears on hover. Must be used inside
			<DocsCode>MapMarker</DocsCode>
			.
		</p>

		<p>
			Extends
			<DocsLink
				href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PopupOptions/"
				external
			>
				PopupOptions
			</DocsLink>
			from MapLibre GL (excluding
			<DocsCode>className</DocsCode>
			,
			<DocsCode>closeButton</DocsCode>
			, and
			<DocsCode>closeOnClick</DocsCode>
			as tooltips auto-dismiss on hover out).
		</p>

		<DocsNote>
			MapLibre&apos;s own
			<DocsCode>className</DocsCode>
			and
			<DocsCode>closeButton</DocsCode>
			options are excluded to prevent style conflicts. Use the component&apos;s
			<DocsCode>className</DocsCode> instead. MapLibre&apos;s default popup styles are reset via CSS.
		</DocsNote>

		<DocsPropTable
			props={[
				{
					name: "children",
					type: "Snippet",
					description: "Tooltip content.",
				},
				{
					name: "className",
					type: "string",
					description: "Additional CSS classes for the tooltip container.",
				},
			]}
		/>
	</DocsSection>

	<!-- MarkerLabel -->
	<DocsSection title="MarkerLabel">
		<p>
			Renders a text label above or below the marker. Must be used inside
			<DocsCode>MarkerContent</DocsCode>
			.
		</p>

		<DocsPropTable
			props={[
				{
					name: "children",
					type: "Snippet",
					description: "Label text content.",
				},
				{ name: "className", type: "string", description: "Additional CSS classes for the label." },
				{
					name: "position",
					type: '"top" | "bottom"',
					default: '"top"',
					description: "Position of the label relative to the marker.",
				},
			]}
		/>
	</DocsSection>

	<!-- MapPopup -->
	<DocsSection title="MapPopup">
		<p>
			A standalone popup component that can be placed anywhere on the map without a marker. Must be
			used inside
			<DocsCode>Map</DocsCode>
			.
		</p>

		<p>
			Extends
			<DocsLink
				href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PopupOptions/"
				external
			>
				PopupOptions
			</DocsLink>
			from MapLibre GL (excluding
			<DocsCode>className</DocsCode>
			and
			<DocsCode>closeButton</DocsCode>
			).
		</p>

		<DocsNote>
			MapLibre&apos;s own
			<DocsCode>className</DocsCode>
			and
			<DocsCode>closeButton</DocsCode>
			options are excluded to prevent style conflicts. Use the component&apos;s props of the same name
			instead. MapLibre&apos;s default popup styles are reset via CSS.
		</DocsNote>

		<DocsPropTable
			props={[
				{
					name: "longitude",
					type: "number",
					description: "Longitude coordinate for popup position.",
				},
				{
					name: "latitude",
					type: "number",
					description: "Latitude coordinate for popup position.",
				},
				{
					name: "onClose",
					type: "() => void",
					description: "Callback when popup is closed.",
				},
				{
					name: "children",
					type: "Snippet",
					description: "Popup content.",
				},
				{
					name: "className",
					type: "string",
					description: "Additional CSS classes for the popup container.",
				},
				{
					name: "closeButton",
					type: "boolean",
					default: "false",
					description: "Show a close button in the popup.",
				},
			]}
		/>
	</DocsSection>

	<!-- MapRoute -->
	<DocsSection title="MapRoute">
		<p>
			Renders a line/route on the map connecting coordinate points. Must be used inside
			<DocsCode>Map</DocsCode>
			. Supports click and hover interactions for building route selection UIs.
		</p>
		<p>
			The coordinates are the only input required, so any routing service works. Pass <DocsCode
				>route.geometry.coordinates</DocsCode
			> from a GeoJSON response.
		</p>
		<p>
			<DocsCode>progress</DocsCode> marks how far along the route you are; add a <DocsCode
				>RouteProgress</DocsCode
			> child to draw that portion. Mark one route <DocsCode>active</DocsCode> to raise it above its siblings
			with the <DocsCode>active*</DocsCode> styles.
		</p>

		<DocsPropTable
			props={[
				{
					name: "id",
					type: "string",
					default: "undefined (auto-generated)",
					description:
						"Optional unique identifier for the route layer. Auto-generated if not provided.",
				},
				{
					name: "coordinates",
					type: "[number, number][]",
					description: "Array of [longitude, latitude] coordinate pairs.",
				},
				{
					name: "color",
					type: "string",
					default: '"#4285F4"',
					description: "Line color (CSS color value).",
				},
				{ name: "width", type: "number", default: "3", description: "Line width in pixels." },
				{ name: "opacity", type: "number", default: "0.8", description: "Line opacity (0 to 1)." },
				{
					name: "dashArray",
					type: "[number, number]",
					description: "Dash pattern [dash length, gap length] for dashed lines.",
				},
				{
					name: "onclick",
					type: "() => void",
					description: "Callback when the route line is clicked.",
				},
				{
					name: "progress",
					type: "number",
					description: "Fraction of the route already covered (0 to 1).",
				},
				{
					name: "active",
					type: "boolean",
					default: "false",
					description:
						"Raise this route and its child layers above siblings and apply active styles.",
				},
				{
					name: "activeColor",
					type: "string",
					description: "Active line color. Falls back to color.",
				},
				{
					name: "activeWidth",
					type: "number",
					description: "Active line width. Falls back to width.",
				},
				{
					name: "activeOpacity",
					type: "number",
					description: "Active line opacity. Falls back to opacity.",
				},
				{
					name: "activeDashArray",
					type: "[number, number]",
					description: "Active dash pattern. Falls back to dashArray.",
				},
				{
					name: "beforeId",
					type: "string",
					description: "MapLibre layer to insert the route and its child layers before.",
				},
				{
					name: "onmouseenter",
					type: "() => void",
					description: "Callback when the pointer enters the route.",
				},
				{
					name: "onmouseleave",
					type: "() => void",
					description: "Callback when the pointer leaves the route.",
				},
				{
					name: "interactive",
					type: "boolean",
					default: "true",
					description: "Respond to mouse events and show a pointer cursor.",
				},
				{
					name: "children",
					type: "Snippet",
					description: "Route subcomponents (RouteProgress, RouteMarker).",
				},
			]}
		/>
	</DocsSection>

	<DocsSection title="RouteProgress">
		<p>
			Draws the covered portion of the parent <DocsCode>MapRoute</DocsCode> on top of the base line, ending
			exactly at its <DocsCode>progress</DocsCode> fraction. Must be inside <DocsCode
				>MapRoute</DocsCode
			>. Renders nothing until progress is set.
		</p>
		<DocsPropTable
			props={[
				{
					name: "color",
					type: "string",
					default: "the route's color",
					description: "Line color for the covered portion.",
				},
				{
					name: "width",
					type: "number",
					default: "the route's width",
					description: "Line width in pixels.",
				},
				{
					name: "opacity",
					type: "number",
					default: "the route's opacity",
					description: "Line opacity (0 to 1).",
				},
				{
					name: "dashArray",
					type: "[number, number]",
					description: "Dash pattern [dash length, gap length].",
				},
			]}
		/>
	</DocsSection>
	<DocsSection title="RouteMarker">
		<p>
			A <DocsCode>MapMarker</DocsCode> pinned to a position along its parent <DocsCode
				>MapRoute</DocsCode
			>. Must be inside <DocsCode>MapRoute</DocsCode>. Accepts every marker prop except <DocsCode
				>longitude</DocsCode
			> and <DocsCode>latitude</DocsCode>, and the same children.
		</p>
		<DocsPropTable
			props={[
				{
					name: "at",
					type: '"start" | "end" | "progress" | number',
					description: "Where to pin the marker. A number is a fraction along the line (0 to 1).",
				},
				{
					name: "children",
					type: "Snippet",
					description:
						"Marker subcomponents (MarkerContent, MarkerPopup, MarkerTooltip, MarkerLabel).",
				},
				{
					name: "...props",
					type: "MapMarker props",
					description: "Any other MapMarker prop (offset, onclick, draggable, rotation, ...).",
				},
			]}
		/>
	</DocsSection>

	<!-- MapClusterLayer -->
	<DocsSection title="MapClusterLayer">
		<p>
			Renders clustered point data using MapLibre GL&apos;s native clustering. Automatically groups
			nearby points into clusters that expand on click. Must be used inside
			<DocsCode>Map</DocsCode>
			. Supports a generic type parameter for typed feature properties:
			<DocsCode>MapClusterLayer&lt;MyProperties&gt;</DocsCode>
			.
		</p>

		<DocsPropTable
			props={[
				{
					name: "data",
					type: "string | GeoJSON.FeatureCollection",
					description: "GeoJSON FeatureCollection data or URL to fetch GeoJSON from.",
				},
				{
					name: "clusterMaxZoom",
					type: "number",
					default: "14",
					description: "Maximum zoom level to cluster points on.",
				},
				{
					name: "clusterRadius",
					type: "number",
					default: "50",
					description: "Radius of each cluster when clustering points (in pixels).",
				},
				{
					name: "clusterColors",
					type: "[string, string, string]",
					default: '["#3b82f6", "#1d4ed8", "#1e3a8a"]',
					description: "Colors for cluster circles: [small, medium, large] based on point count.",
				},
				{
					name: "clusterThresholds",
					type: "[number, number]",
					default: "[100, 750]",
					description: "Point count thresholds for color/size steps: [medium, large].",
				},
				{
					name: "pointColor",
					type: "string",
					default: '"#3b82f6"',
					description: "Color for unclustered individual points.",
				},
				{
					name: "onPointClick",
					type: "(feature: GeoJSON.Feature, coordinates: [number, number]) => void",
					description: "Callback when an unclustered point is clicked.",
				},
				{
					name: "onClusterClick",
					type: "(clusterId: number, coordinates: [number, number], pointCount: number) => void",
					description:
						"Callback when a cluster is clicked. If not provided, zooms into the cluster.",
				},
			]}
		/>
	</DocsSection>
</DocsLayout>
