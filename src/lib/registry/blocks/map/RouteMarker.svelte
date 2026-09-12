<script lang="ts">
	import type { ComponentProps } from "svelte";
	import MapMarker from "./MapMarker.svelte";
	import { useMapRoute } from "./route-context.js";
	import type { RouteAnchor } from "./route.js";

	let {
		at,
		...markerProps
	}: { at: RouteAnchor } & Omit<ComponentProps<typeof MapMarker>, "longitude" | "latitude"> =
		$props();
	const route = useMapRoute();
	const position = $derived(route.pointAt(at));
</script>

{#if position}
	<MapMarker longitude={position[0]} latitude={position[1]} {...markerProps} />
{/if}
