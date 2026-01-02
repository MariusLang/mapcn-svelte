<script lang="ts">
	import { getContext } from "svelte";
	import MapLibreGL, { type PopupOptions } from "maplibre-gl";
	import { cn } from "$lib/utils.js";

	interface Props {
		children?: import("svelte").Snippet;
		class?: string;
		offset?: PopupOptions["offset"];
		anchor?: PopupOptions["anchor"];
	}

	let { children, class: className, offset = 16, anchor }: Props = $props();

	const markerCtx = getContext<{
		getMarker: () => MapLibreGL.Marker | null;
		getElement: () => HTMLDivElement | null;
		getMap: () => MapLibreGL.Map | null;
		isReady: () => boolean;
	}>("marker");

	let wrapperElement: HTMLDivElement | null = $state(null);

	// Create tooltip popup when marker is ready
	$effect(() => {
		const marker = markerCtx.getMarker();
		const markerElement = markerCtx.getElement();
		const map = markerCtx.getMap();
		const ready = markerCtx.isReady();

		if (!ready || !marker || !markerElement || !map || !wrapperElement) return;

		// Create popup container
		const container = document.createElement("div");

		// Build popup options
		const popupOptions: PopupOptions = {
			offset,
			closeOnClick: true,
			closeButton: false,
			className: "maplibre-popup-transparent",
		};

		if (anchor !== undefined) popupOptions.anchor = anchor;

		// Create popup
		const popupInstance = new MapLibreGL.Popup(popupOptions)
			.setMaxWidth("none")
			.setDOMContent(container);

		// Move content to popup container
		while (wrapperElement.firstChild) {
			container.appendChild(wrapperElement.firstChild);
		}

		// Show on hover
		const handleMouseEnter = () => {
			popupInstance.setLngLat(marker.getLngLat()).addTo(map);
		};

		const handleMouseLeave = () => {
			popupInstance.remove();
		};

		markerElement.addEventListener("mouseenter", handleMouseEnter);
		markerElement.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			markerElement.removeEventListener("mouseenter", handleMouseEnter);
			markerElement.removeEventListener("mouseleave", handleMouseLeave);

			// Move content back
			while (container.firstChild) {
				wrapperElement?.appendChild(container.firstChild);
			}

			popupInstance.remove();
		};
	});
</script>

<div bind:this={wrapperElement} style="display: contents;">
	<div
		class={cn(
			"animate-in fade-in-0 zoom-in-95 bg-foreground text-background rounded-md px-2 py-1 text-xs shadow-md",
			className
		)}
	>
		{@render children?.()}
	</div>
</div>

<style>
	:global(.maplibre-popup-transparent .maplibregl-popup-content) {
		background: transparent;
		box-shadow: none;
		padding: 0;
	}

	:global(.maplibre-popup-transparent .maplibregl-popup-tip) {
		display: none;
	}
</style>
