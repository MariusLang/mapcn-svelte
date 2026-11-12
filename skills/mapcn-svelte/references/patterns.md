# Patterns

Import MapCN Svelte APIs from the map directory under your UI alias, usually `$lib/components/ui/map`. See [Components](components.md) for working examples.

## Controlled viewport

Pass both `viewport` and `onviewportchange` for a camera driven by application state. Use the callback alone to observe user interactions.

```svelte
<script lang="ts">
	import { Map, type MapViewport } from "$lib/components/ui/map";

	let viewport = $state<MapViewport>({
		center: [-74.006, 40.7128],
		zoom: 8,
		bearing: 0,
		pitch: 0,
	});
</script>

<div class="h-96">
	<Map {viewport} onviewportchange={(next) => (viewport = next)} />
</div>
```

## Fly to a place

Bind the map from the parent when a list item or external control moves the camera.

```svelte
<script lang="ts">
	import type { Map as MapInstance } from "maplibre-gl";
	import { Map } from "$lib/components/ui/map";

	let map = $state<MapInstance | null>(null);
</script>

<button type="button" onclick={() => map?.flyTo({ center: [-74.006, 40.7128], zoom: 14 })}>
	Go to New York
</button>
<div class="h-96">
	<Map bind:map />
</div>
```

For a control rendered inside the map, use `const context = useMap()` and read `context.map` when the button is clicked. To frame several points, call `map.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 48 })`. For initial framing, pass bounds and padding through `options`.

## Routes from a directions API

Fetch directions in a SvelteKit load function or in the map’s parent component. OSRM’s demo endpoint is useful for prototypes. Use a routing service suited to production traffic for a deployed application.

```ts
const endpoint = "https://router.project-osrm.org/route/v1/driving";
const response = await fetch(
	`${endpoint}/${origin.join(",")};${destination.join(",")}?overview=full&geometries=geojson`
);
if (!response.ok) throw new Error("Directions request failed");
const result = await response.json();
const coordinates: [number, number][] = result.routes?.[0]?.geometry?.coordinates ?? [];
```

Pass the coordinates and an application-owned progress fraction between 0 and 1 into the route. Render a separate empty or error state if the service returns no route.

```svelte
<MapRoute {coordinates} {progress}>
	<RouteProgress color="#3b82f6" />
	<RouteMarker at="progress">
		<MarkerContent>Courier</MarkerContent>
	</RouteMarker>
</MapRoute>
```

See the OSRM and progress examples in [Components](components.md), or install [Delivery Tracker](blocks.md#delivery-tracker) for a full page.

## Custom MapLibre layers

Create a child component for custom layers such as a heatmap. Read the reactive context getters inside the effect. Use IDs unique to the map and clean up layers before sources.

```svelte
<script lang="ts">
	import type { FeatureCollection, Point } from "geojson";
	import { useMap } from "$lib/components/ui/map";

	const { data }: { data: FeatureCollection<Point> } = $props();
	const context = useMap();

	$effect(() => {
		const map = context.map;
		if (!map || !context.isStyleReady) return;

		map.addSource("app-heat", { type: "geojson", data });
		map.addLayer({ id: "app-heat", type: "heatmap", source: "app-heat" });

		return () => {
			if (map.getLayer("app-heat")) map.removeLayer("app-heat");
			if (map.getSource("app-heat")) map.removeSource("app-heat");
		};
	});
</script>
```

The readiness getter changes when the theme replaces the basemap, so the effect reinstalls the layers. Use `onstyleloaded` with `bind:map` when the parent owns style setup. Remove any event listeners you attach and guard cleanup in case a style swap already removed the layer.

## Large datasets

- Use `MapClusterLayer` for many points that should cluster. Keep DOM markers for features needing rich interactive content.
- Use GeoJSON or native MapLibre layers for large sets of styled features. Keep the data reference stable between unrelated updates and use `$derived` for real transformations.

## Choropleths and data-only maps

Use `<Map blank>` with `MapGeoJSON`. Join values onto feature properties and use a MapLibre expression in `fillPaint["fill-color"]`, for example `["interpolate", ["linear"], ["get", "value"], 0, "#e5e7eb", 100, "#1d4ed8"]`. The [Choropleth block](blocks.md#choropleth) adds a legend and hover interaction.

## Globe

Use `projection={{ type: "globe" }}` on `Map`. A globe works well for worldwide arcs, heatmaps, or clustered locations at low zoom. Pair it with `blank` for a tinted sphere and add your own geographic layers. See [Community Globe](blocks.md#community-globe).

## SvelteKit and browser-only code

Keep SSR for the route. MapCN initializes MapLibre in the browser. Run your own browser API calls in `onMount`, in a browser-only effect, or behind SvelteKit’s `browser` flag. Keep private API keys in server-only load functions or endpoints. Serve tiles and GeoJSON URLs that allow requests from your app’s origin.

## Web Worker and CSP

By default the map sets the MapLibre worker URL to the installed version on unpkg. For a strict Content Security Policy, allow the worker and its dependencies. Merge these directives into your existing policy and allow the basemap and data hosts your app uses.

```text
script-src 'self' https://unpkg.com;
worker-src 'self' blob:;
```

To self-host, place `maplibre-gl-worker.mjs` and `maplibre-gl-shared.mjs` from `node_modules/maplibre-gl/dist/` side by side in `static/` for SvelteKit or `public/` for a Vite app. Call `setWorkerUrl` from `maplibre-gl` with the served worker URL before constructing a map. See [Installation](https://mapcn-svelte.dev/docs/installation#web-worker) for the worker setup.
