<script lang="ts">
	import { getContext } from "svelte";
	import MapLibreGL, { type PopupOptions } from "maplibre-gl";
	import { cn } from "$lib/utils.js";
	import X from "@lucide/svelte/icons/x";

	interface Props {
		children?: import("svelte").Snippet;
		class?: string;
		closeButton?: boolean;
		offset?: PopupOptions["offset"];
		anchor?: PopupOptions["anchor"];
		closeOnClick?: boolean;
		closeOnMove?: boolean;
		focusAfterOpen?: boolean;
		maxWidth?: string;
	}

	let {
		children,
		class: className,
		closeButton = false,
		offset = 16,
		anchor,
		closeOnClick,
		closeOnMove,
		focusAfterOpen,
		maxWidth,
	}: Props = $props();

	const markerCtx = getContext<{
		getMarker: () => MapLibreGL.Marker | null;
		getElement: () => HTMLDivElement | null;
		getMap: () => MapLibreGL.Map | null;
		isReady: () => boolean;
	}>("marker");

	let popup: MapLibreGL.Popup | null = null;
	let wrapperElement: HTMLDivElement | null = $state(null);

	// Create popup when marker is ready
	$effect(() => {
		const marker = markerCtx.getMarker();
		const ready = markerCtx.isReady();

		if (!ready || !marker || !wrapperElement) return;

		// Create popup container
		const container = document.createElement("div");

		// Build popup options
		const popupOptions: PopupOptions = {
			offset,
			closeButton: false,
			className: "maplibre-popup-transparent",
		};

		if (anchor !== undefined) popupOptions.anchor = anchor;
		if (closeOnClick !== undefined) popupOptions.closeOnClick = closeOnClick;
		if (closeOnMove !== undefined) popupOptions.closeOnMove = closeOnMove;
		if (focusAfterOpen !== undefined) popupOptions.focusAfterOpen = focusAfterOpen;

		// Create popup
		const popupInstance = new MapLibreGL.Popup(popupOptions).setDOMContent(container);

		if (maxWidth) {
			popupInstance.setMaxWidth(maxWidth);
		} else {
			popupInstance.setMaxWidth("none");
		}

		// Attach popup to marker
		marker.setPopup(popupInstance);
		popup = popupInstance;

		// Move content to popup container
		while (wrapperElement.firstChild) {
			container.appendChild(wrapperElement.firstChild);
		}

		return () => {
			// Move content back
			while (container.firstChild) {
				wrapperElement?.appendChild(container.firstChild);
			}

			popupInstance.remove();
			popup = null;
		};
	});

	function handleClose() {
		popup?.remove();
	}
</script>

<div bind:this={wrapperElement} style="display: contents;">
	<div
		class={cn(
			"animate-in fade-in-0 zoom-in-95 bg-popover text-popover-foreground relative rounded-md border p-3 shadow-md",
			className
		)}
	>
		{#if closeButton}
			<button
				type="button"
				onclick={handleClose}
				class="ring-offset-background focus:ring-ring absolute top-1 right-1 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
				aria-label="Close popup"
			>
				<X class="h-4 w-4" />
				<span class="sr-only">Close</span>
			</button>
		{/if}
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
