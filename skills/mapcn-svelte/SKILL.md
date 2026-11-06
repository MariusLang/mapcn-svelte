---
name: mapcn-svelte
description: "Install and compose MapCN Svelte components and blocks for Svelte 5 projects. Use for interactive MapLibre maps, markers, routes, GeoJSON layers, and map-based dashboards."
---

# MapCN Svelte

Use the [Svelte registry](https://mapcn-svelte.dev/r/index.json) to find installable components and blocks. Read the [API reference](https://mapcn-svelte.dev/docs/api-reference) before choosing props or events, and the [blocks catalog](https://mapcn-svelte.dev/blocks) for complete layouts with source and preview.

## Install

Run the shadcn-svelte CLI using the consumer's package manager. Initialize shadcn-svelte if the project has no `components.json`.

```sh
npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/map.json
```

For a full block, replace `map.json` with the block name, for example `community-globe.json`. The CLI resolves its registry dependencies. Check the configured UI alias before writing imports.

## Compose a map

```svelte
<script lang="ts">
	import { Map, MapControls } from "$lib/components/ui/map";
</script>

<div class="h-[360px]">
	<Map center={[-74.006, 40.7128]} zoom={11}>
		<MapControls />
	</Map>
</div>
```

- Give the map container an explicit height. Coordinates are longitude first.
- Use the map's children to compose markers, popups, route progress, and GeoJSON layers. For a globe, pass `projection={{ type: "globe" }}`. For a tile-less basemap, use `blank`.
- Pass `viewport` and `onviewportchange` together to control the camera. Use `bind:map` for imperative methods such as `flyTo`, and wait until the instance exists.
- For a custom worker URL or a strict content security policy, follow the [installation guide](https://mapcn-svelte.dev/docs/installation). Configure the worker before mounting a map.
- Preview the result with WebGL2, and verify map styles, route endpoints, and any external data URLs in the target deployment.
