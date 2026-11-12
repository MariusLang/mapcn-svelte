---
name: mapcn-svelte
description: "Build maps in Svelte 5 and SvelteKit with MapCN Svelte, MapLibre GL, Tailwind CSS, and shadcn-svelte. Use for markers, popups, routes, arcs, GeoJSON, choropleths, clusters, globes, custom basemaps, or complete map blocks such as a store locator, delivery tracker, or analytics dashboard. Also use when asked where a map would fit in an existing Svelte app."
---

# MapCN Svelte

MapCN Svelte provides composable map components and complete map pages through a shadcn-svelte registry. The installed `map/` directory sits under the consumer’s configured UI alias.

## When the user hasn’t picked a map

1. Read `package.json`, `components.json`, and the pages and data models relevant to the request.
2. Suggest two to four places a map would fit. Tie each idea to existing data and name a suitable component or block. Addresses fit **Store Locator**, shipment data fits **Delivery Tracker**, regional metrics fit **Choropleth**, and connections between places fit `MapArc` or **Logistics Network**.
3. If the user asked for ideas, wait for them to pick a direction before installing or changing the app.

## Before you start

- Check for Svelte 5, Tailwind CSS, and `components.json`. If shadcn-svelte hasn’t been initialized, explain the prerequisite and offer to run `npx shadcn-svelte@latest init`.
- Resolve `aliases.ui` from `components.json` and look for its `map/index.ts`. Read and reuse an existing installation.
- Check existing routes and shared files before adding a block.

## Install

```sh
npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/map.json
```

Use the project’s package manager. The map item installs Svelte components, MapLibre GL, GeoJSON types, and shared map styles. Blocks install through their own registry URLs and pull in the map and other dependencies. Read [the block reference](references/blocks.md) for the command, file targets, and preview.

If installation fails, inspect the [map registry item](https://mapcn-svelte.dev/r/map.json) or [registry index](https://mapcn-svelte.dev/r/index.json) to diagnose the failure. Preserve existing project files and report any unresolved CLI error.

## Rules

- Give `Map` a sized parent, such as `<div class="h-[400px]">`. It fills the parent.
- Pass coordinates in `[longitude, latitude]` order. Markers use separate `longitude` and `latitude` props.
- SvelteKit can render the page on the server. Browser-only map code runs after mount. Fetch data in a load function when appropriate and pass it to the map component.
- Read the installed types for exact props and callbacks. `MapRoute` draws coordinates from your directions service. Put `RouteProgress` and `RouteMarker` inside the route and drive progress from your own state.
- Use theme tokens such as `bg-background` and `text-muted-foreground` for marker and popup UI. Use data colors for map paints. The map follows an explicit light/dark class or `data-theme` on `<html>`, then the system preference. Pass `theme` to force a specific mode.
- For raw MapLibre, use `bind:map` or call `useMap()` from a child component. Keep its reactive getters intact, wait for style readiness before adding layers, and remove custom sources, layers, and listeners on cleanup.

<!-- generated:basemap -->

## Basemap Selection

- Use `<Map>` without `blank` for the default free CARTO basemap tiles. This is best for store locators, delivery tracking, logistics maps, address maps, and any UI where users need streets, place labels, or geographic context.
- Use `<Map blank>` for a transparent, tile-less canvas. Add your own layers such as `MapGeoJSON`, `MapArc`, markers, clusters, or custom MapLibre layers. A blank globe has a tinted sphere. This is best for choropleths, arc maps, dot maps, dashboards, and data visualizations where the data should define the geography.
- If the user wants a blank map with only countries or country borders, use `<Map blank>` with `<MapGeoJSON data={WORLD_GEOJSON} />`. For world countries, a Natural Earth GeoJSON source works well: `https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson`. Users can also provide their own GeoJSON URL or GeoJSON object to `MapGeoJSON`.
- Use the `styles` prop for custom MapLibre-compatible style URLs or style objects, for example MapTiler, OpenFreeMap, CARTO, or a self-hosted style. Explicit `styles` override `blank`.

<!-- /generated:basemap -->

## Components

Import from the installed map directory, usually `$lib/components/ui/map`.

<!-- generated:components -->

- **Map** — `Map`, `MapViewport`, `useMap`
- **Controls** — `MapControls`
- **Markers** — `MapMarker`, `MarkerContent`, `MarkerPopup`, `MarkerTooltip`, `MarkerLabel`
- **Popups** — `MapPopup`
- **Routes** — `MapRoute`, `RouteProgress`, `RouteMarker`, `RouteAnchor`
- **Arcs** — `MapArc`, `MapArcDatum`, `MapArcEvent`, `MapArcProps`
- **GeoJSON** — `MapGeoJSON`, `MapGeoJSONEvent`, `MapGeoJSONProps`
- **Clusters** — `MapClusterLayer`

<!-- /generated:components -->

## References

- [Components](references/components.md) for exports, docs, and Svelte example source.
- [Blocks](references/blocks.md) for installation commands, targets, dependencies, and previews.
- [Patterns](references/patterns.md) for viewport control, fly-to, route fetching, custom layers, large datasets, globe, and worker configuration.

When reading the skill online, find its references in the [repository](https://github.com/MariusLang/mapcn-svelte/tree/main/skills/mapcn-svelte/references).
