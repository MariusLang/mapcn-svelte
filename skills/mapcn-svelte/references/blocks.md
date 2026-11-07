# Blocks

Blocks are complete Svelte pages with sample data. Replace the sample data with the application’s data and keep the block’s relative imports intact.

## Routes and file placement

- In SvelteKit, place the block under the configured routes directory, usually `src/routes`. Keep `+page.svelte` and its companion files together. Check for an existing route before installing.
- In standalone Svelte or Vite, move the page and its companion files to the appropriate feature directory, rename `+page.svelte` to a regular component such as `StoreLocator.svelte`, and mount it or register it with the app’s router.
- The lists below show registry targets. A target starting with `~/` is relative to the project root. Shared library files resolve under the configured library alias, and imports of the map resolve through the UI alias. Confirm the resolved paths in the CLI output.

## Analytics Map

Real-time analytics overview with a world map, breakdown cards, and device stats.

```sh
npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/analytics-map.json
```

- Registry file targets — `analytics/+page.svelte`, `~/src/routes/analytics/data.ts`, `~/src/routes/analytics/OverviewCard.svelte`, `~/src/routes/analytics/BreakdownCard.svelte`
- Registry dependencies — `https://mapcn-svelte.dev/r/map.json`, `card`
- [Preview and source](https://mapcn-svelte.dev/blocks/analytics-map)

## Choropleth

World choropleth map shading countries by a metric, with a hover tooltip and legend.

```sh
npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/choropleth.json
```

- Registry file targets — `choropleth/+page.svelte`, `~/src/routes/choropleth/data.ts`, `use-world-data.svelte.ts`, `theme.ts`
- Registry dependencies — `https://mapcn-svelte.dev/r/map.json`
- [Preview and source](https://mapcn-svelte.dev/blocks/choropleth)

## Analytics Card

Compact analytics card with a headline metric over a world map.

```sh
npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/analytics-card.json
```

- Registry file targets — `analytics-card/+page.svelte`, `~/src/routes/analytics-card/data.ts`
- Registry dependencies — `https://mapcn-svelte.dev/r/map.json`, `card`, `badge`
- [Preview and source](https://mapcn-svelte.dev/blocks/analytics-card)

## Delivery Tracker

Live order tracking with route progress, courier position, and order details.

```sh
npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/delivery-tracker.json
```

- Registry file targets — `delivery/+page.svelte`, `~/src/routes/delivery/data.ts`, `theme.ts`
- Registry dependencies — `https://mapcn-svelte.dev/r/map.json`, `card`, `badge`, `button`
- [Preview and source](https://mapcn-svelte.dev/blocks/delivery-tracker)

## Uptime Monitor

Status-page style map of edge network locations with live health, latency, and uptime.

```sh
npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/uptime-monitor.json
```

- Registry file targets — `uptime-monitor/+page.svelte`, `~/src/routes/uptime-monitor/data.ts`, `~/src/routes/uptime-monitor/EdgeNodeMarker.svelte`, `~/src/routes/uptime-monitor/StatusSidebar.svelte`
- Registry dependencies — `https://mapcn-svelte.dev/r/map.json`
- [Preview and source](https://mapcn-svelte.dev/blocks/uptime-monitor)

## Heatmap

Globe-projected heatmap visualizing earthquake density with zoom-dependent styling.

```sh
npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/heatmap.json
```

- Registry file targets — `heatmap/+page.svelte`, `~/src/routes/heatmap/GlobeHeatmapLayers.svelte`
- Registry dependencies — `https://mapcn-svelte.dev/r/map.json`
- [Preview and source](https://mapcn-svelte.dev/blocks/heatmap)

## Community Globe

Globe of community members with avatar markers, a member list, local time, and an awake filter.

```sh
npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/community-globe.json
```

- Registry file targets — `community-globe/+page.svelte`, `~/src/routes/community-globe/data.ts`
- Registry dependencies — `https://mapcn-svelte.dev/r/map.json`, `tabs`
- [Preview and source](https://mapcn-svelte.dev/blocks/community-globe)

## Logistics Network

Domestic logistics map with a sidebar of stats.

```sh
npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/logistics-network.json
```

- Registry file targets — `logistics/+page.svelte`, `~/src/routes/logistics/data.ts`, `~/src/routes/logistics/MapArcs.svelte`, `~/src/routes/logistics/FilterSidebar.svelte`, `~/src/routes/logistics/NetworkMap.svelte`
- Registry dependencies — `https://mapcn-svelte.dev/r/map.json`, `sidebar`, `separator`
- [Preview and source](https://mapcn-svelte.dev/blocks/logistics-network)

## Store Locator

Searchable store list synced with map markers.

```sh
npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/store-locator.json
```

- Registry file targets — `store-locator/+page.svelte`, `~/src/routes/store-locator/data.ts`, `~/src/routes/store-locator/StoreList.svelte`, `~/src/routes/store-locator/LocatorMap.svelte`, `~/src/routes/store-locator/FlyToSelected.svelte`
- Registry dependencies — `https://mapcn-svelte.dev/r/map.json`, `input`, `sidebar`
- [Preview and source](https://mapcn-svelte.dev/blocks/store-locator)
