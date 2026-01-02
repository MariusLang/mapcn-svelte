<script lang="ts">
	import { getContext } from "svelte";
	import MapLibreGL from "maplibre-gl";
	import { cn } from "$lib/utils.js";

	interface Props {
		children?: import("svelte").Snippet;
		class?: string;
	}

	let { children, class: className }: Props = $props();

	const markerCtx = getContext<{
		getMarker: () => MapLibreGL.Marker | null;
		getElement: () => HTMLDivElement | null;
		getMap: () => MapLibreGL.Map | null;
		isReady: () => boolean;
	}>("marker");

	let wrapperElement: HTMLDivElement | null = $state(null);
	let movedContent: Node[] = [];

	// Move content to marker element when ready
	$effect(() => {
		const element = markerCtx.getElement();
		const ready = markerCtx.isReady();

		if (!ready || !element || !wrapperElement) return;

		// Store and move children to marker element
		movedContent = Array.from(wrapperElement.childNodes);
		movedContent.forEach((child) => element.appendChild(child));

		return () => {
			// Move content back on cleanup
			movedContent.forEach((child) => {
				if (wrapperElement && child.parentNode === element) {
					wrapperElement.appendChild(child);
				}
			});
			movedContent = [];
		};
	});
</script>

<!-- Hidden wrapper that holds content until marker is ready -->
<div bind:this={wrapperElement} style="display: contents;">
	<div class={cn("relative cursor-pointer", className)}>
		{#if children}
			{@render children()}
		{:else}
			<!-- Default marker icon -->
			<div class="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
		{/if}
	</div>
</div>
