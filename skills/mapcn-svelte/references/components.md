# Components

Install with `npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/map.json`. Import the exports from the `map` directory under the project's configured UI alias, usually `$lib/components/ui/map`. Read the installed components for their full prop types.

Examples use this repository’s aliases. Adjust them to match your project, and copy any companion files listed in the docs demo.

## Map

[Documentation](https://mapcn-svelte.dev/docs/basic-map)

- `Map` — The map container. Set its parent height, choose styles or a projection, and pass MapLibre constructor settings through `options`.
- `MapViewport` — Type for longitude/latitude center, zoom, bearing, and pitch.
- `useMap` — Reads the reactive map, style readiness, and theme from a child component.

Example source:

- [BasicMapExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/BasicMapExample.svelte)
- [BlankMapExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/BlankMapExample.svelte)
- [ControlledMapExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/ControlledMapExample.svelte)
- [CustomStyleExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/CustomStyleExample.svelte)

## Controls

[Documentation](https://mapcn-svelte.dev/docs/controls)

- `MapControls` — Zoom, compass, locate, and fullscreen controls. Use the `show*` props and `position` to configure them.

Example source:

- [MapControlsExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/MapControlsExample.svelte)

## Markers

[Documentation](https://mapcn-svelte.dev/docs/markers)

- `MapMarker` — DOM marker at `longitude` and `latitude`. Supports dragging and mouse events.
- `MarkerContent` — Renders custom content inside a marker.
- `MarkerPopup` — Opens a popup on marker click.
- `MarkerTooltip` — Shows a tooltip on marker hover.
- `MarkerLabel` — Adds a label above or below the marker.

Example source:

- [MarkersExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/MarkersExample.svelte)
- [PopupExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/PopupExample.svelte)
- [DraggableMarkerExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/DraggableMarkerExample.svelte)

## Popups

[Documentation](https://mapcn-svelte.dev/docs/popups)

- `MapPopup` — Standalone popup at a coordinate. Render it conditionally and clear the selection in `onclose`.

Example source:

- [StandalonePopupExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/StandalonePopupExample.svelte)

## Routes

[Documentation](https://mapcn-svelte.dev/docs/routes)

- `MapRoute` — Draws a line from `coordinates` and accepts a `progress` fraction. Fetch directions outside it.
- `RouteProgress` — Styles the traveled part of the parent route.
- `RouteMarker` — Positions a marker at the start, end, current progress, or a numeric fraction of the parent route.
- `RouteAnchor` — Type for the positions accepted by `RouteMarker`.

Example source:

- [RouteProgressExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/RouteProgressExample.svelte)
- [RouteExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/RouteExample.svelte)
- [OsrmRouteExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/OsrmRouteExample.svelte)

## Arcs

[Documentation](https://mapcn-svelte.dev/docs/arcs)

- `MapArc` — Draws arcs between coordinate pairs and supports hover and click events.
- `MapArcDatum` — Type for an arc datum.
- `MapArcEvent` — Type for an arc interaction event.
- `MapArcProps` — Props accepted by `MapArc`.

Example source:

- [ArcExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/ArcExample.svelte)
- [InteractiveArcExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/InteractiveArcExample.svelte)

## GeoJSON

[Documentation](https://mapcn-svelte.dev/docs/geojson)

- `MapGeoJSON` — Draws fill and outline layers from a GeoJSON object or URL. Use expressions for data-driven paint.
- `MapGeoJSONEvent` — Type for a GeoJSON feature interaction event.
- `MapGeoJSONProps` — Props accepted by `MapGeoJSON`.

Example source:

- [GeoJSONExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/GeoJSONExample.svelte)
- [MapOverlayExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/MapOverlayExample.svelte)

## Clusters

[Documentation](https://mapcn-svelte.dev/docs/clusters)

- `MapClusterLayer` — Clusters GeoJSON points in MapLibre and supports point and cluster click handlers.

Example source:

- [ClusterExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/ClusterExample.svelte)

## Advanced

[Documentation](https://mapcn-svelte.dev/docs/advanced-usage)

Example source:

- [AdvancedUsageExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/AdvancedUsageExample.svelte)
- [CustomLayerExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/CustomLayerExample.svelte)
- [LayerMarkersExample.svelte](https://github.com/MariusLang/mapcn-svelte/blob/main/src/lib/components/docs/preview/examples/LayerMarkersExample.svelte)
