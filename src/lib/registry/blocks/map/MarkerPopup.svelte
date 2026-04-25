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
		isDraggable?: () => boolean;
		isDragging?: () => boolean;
	}>("marker");

	let popup: MapLibreGL.Popup | null = null;
	let wrapperElement: HTMLDivElement | null = $state(null);
	let shouldStayOpen = $state(false);

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

		// If marker is draggable, preserve popup state during movement
		if (markerCtx.isDraggable?.()) {
			popupOptions.closeOnMove = false;
		}

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

		// Prevent popup from closing during drag
		$effect(() => {
			const isDragging = markerCtx.isDragging?.();
			if (isDragging && popupInstance.isOpen()) {
				shouldStayOpen = true;
			}
		});

		// Reopen popup after drag if it was open
		$effect(() => {
			const isDragging = markerCtx.isDragging?.();
			if (!isDragging && shouldStayOpen && !popupInstance.isOpen()) {
				// Small delay to ensure popup has finished closing
				setTimeout(() => {
					if (!popupInstance.isOpen()) {
						marker.togglePopup();
					}
					shouldStayOpen = false;
				}, 10);
			}
		});

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
			"bg-popover text-popover-foreground relative max-w-62 rounded-md border p-3 shadow-md",
			"animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
			className
		)}
	>
		{#if closeButton}
			<button
				type="button"
				onclick={handleClose}
				aria-label="Close popup"
				class="focus-visible:ring-ring hover:bg-muted text-foreground absolute top-0.5 right-0.5 z-10 inline-flex size-5 cursor-pointer items-center justify-center rounded-sm transition-colors focus:outline-none focus-visible:ring-2"
			>
				<X class="size-3.5" />
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
