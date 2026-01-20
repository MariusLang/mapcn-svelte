<script lang="ts">
	import { getContext, setContext } from "svelte";
	import MapLibreGL, { type MarkerOptions } from "maplibre-gl";

	type Anchor =
		| "center"
		| "top"
		| "bottom"
		| "left"
		| "right"
		| "top-left"
		| "top-right"
		| "bottom-left"
		| "bottom-right";

	interface Props {
		longitude: number;
		latitude: number;
		children?: import("svelte").Snippet;
		onclick?: (e: MouseEvent) => void;
		onmouseenter?: (e: MouseEvent) => void;
		onmouseleave?: (e: MouseEvent) => void;
		ondragstart?: (lngLat: { lng: number; lat: number }) => void;
		ondrag?: (lngLat: { lng: number; lat: number }) => void;
		ondragend?: (lngLat: { lng: number; lat: number }) => void;
		draggable?: boolean;
		anchor?: Anchor;
		offset?: MarkerOptions["offset"];
		rotation?: number;
		pitchAlignment?: MarkerOptions["pitchAlignment"];
		rotationAlignment?: MarkerOptions["rotationAlignment"];
	}

	let {
		longitude,
		latitude,
		children,
		onclick,
		onmouseenter,
		onmouseleave,
		ondragstart,
		ondrag,
		ondragend,
		draggable = false,
		anchor = "center",
		offset,
		rotation,
		pitchAlignment,
		rotationAlignment,
	}: Props = $props();

	const mapCtx = getContext<{
		getMap: () => MapLibreGL.Map | null;
		isLoaded: () => boolean;
	}>("map");

	let marker: MapLibreGL.Marker | null = $state(null);
	let markerElement: HTMLDivElement | null = $state(null);
	let isReady = $state(false);
	let isDragging = $state(false);

	// Provide marker context for child components
	setContext("marker", {
		getMarker: () => marker,
		getElement: () => markerElement,
		getMap: () => mapCtx.getMap(),
		isReady: () => isReady,
		isDraggable: () => draggable,
		isDragging: () => isDragging,
	});

	// Create marker when map is ready
	$effect(() => {
		const map = mapCtx.getMap();
		const mapLoaded = mapCtx.isLoaded();

		if (!map || !mapLoaded) return;

		// Validate coordinates
		if (
			typeof longitude !== "number" ||
			typeof latitude !== "number" ||
			Number.isNaN(longitude) ||
			Number.isNaN(latitude)
		) {
			return;
		}

		// Create container element programmatically
		const container = document.createElement("div");
		container.className = "cursor-pointer";
		markerElement = container;

		// Build marker options
		const markerOptions: MarkerOptions = {
			element: container,
			draggable,
			anchor,
		};

		if (offset !== undefined) markerOptions.offset = offset;
		if (rotation !== undefined) markerOptions.rotation = rotation;
		if (pitchAlignment !== undefined) markerOptions.pitchAlignment = pitchAlignment;
		if (rotationAlignment !== undefined) markerOptions.rotationAlignment = rotationAlignment;

		// Create and add marker
		const markerInstance = new MapLibreGL.Marker(markerOptions)
			.setLngLat([longitude, latitude])
			.addTo(map);

		marker = markerInstance;

		// Mouse event listeners on the container
		if (onclick) container.addEventListener("click", onclick);
		if (onmouseenter) container.addEventListener("mouseenter", onmouseenter);
		if (onmouseleave) {
			container.addEventListener("mouseleave", (e) => {
				if (!isDragging) onmouseleave(e);
			});
		}

		// Drag event handlers
		const handleDragStart = () => {
			isDragging = true;
			const lngLat = markerInstance.getLngLat();
			ondragstart?.({ lng: lngLat.lng, lat: lngLat.lat });
		};
		const handleDrag = () => {
			const lngLat = markerInstance.getLngLat();
			ondrag?.({ lng: lngLat.lng, lat: lngLat.lat });
		};
		const handleDragEnd = () => {
			isDragging = false;
			const lngLat = markerInstance.getLngLat();
			ondragend?.({ lng: lngLat.lng, lat: lngLat.lat });
		};

		if (draggable) {
			markerInstance.on("dragstart", handleDragStart);
			markerInstance.on("drag", handleDrag);
			markerInstance.on("dragend", handleDragEnd);
		}

		isReady = true;

		// Cleanup
		return () => {
			if (onclick) container.removeEventListener("click", onclick);
			if (onmouseenter) container.removeEventListener("mouseenter", onmouseenter);
			if (onmouseleave) container.removeEventListener("mouseleave", onmouseleave);

			if (draggable) {
				markerInstance.off("dragstart", handleDragStart);
				markerInstance.off("drag", handleDrag);
				markerInstance.off("dragend", handleDragEnd);
			}

			markerInstance.remove();
			marker = null;
			markerElement = null;
			isReady = false;
		};
	});

	// Update position when coordinates change
	$effect(() => {
		if (
			marker &&
			typeof longitude === "number" &&
			typeof latitude === "number" &&
			!Number.isNaN(longitude) &&
			!Number.isNaN(latitude)
		) {
			marker.setLngLat([longitude, latitude]);
		}
	});

	// Update draggable when prop changes
	$effect(() => {
		marker?.setDraggable(draggable);
	});
</script>

<!-- Children are MarkerContent, MarkerPopup, MarkerTooltip -->
{@render children?.()}
