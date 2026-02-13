<script lang="ts">
	import { onMount, onDestroy, setContext, untrack } from "svelte";
	import MapLibreGL from "maplibre-gl";
	import "maplibre-gl/dist/maplibre-gl.css";
	import { browser } from "$app/environment";

	// Check document class for theme (works with next-themes, etc.)
	function getDocumentTheme(): "light" | "dark" | null {
		if (typeof document === "undefined") return null;
		if (document.documentElement.classList.contains("dark")) return "dark";
		if (document.documentElement.classList.contains("light")) return "light";
		return null;
	}

	// Get system preference
	function getSystemTheme(): "light" | "dark" {
		if (typeof window === "undefined") return "light";
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}

	let tailwindTheme: "light" | "dark" = $state("light");

	type MapStyleOption = string | MapLibreGL.StyleSpecification;

	/** Map viewport state */
	export type MapViewport = {
		/** Center coordinates [longitude, latitude] */
		center: [number, number];
		/** Zoom level */
		zoom: number;
		/** Bearing (rotation) in degrees */
		bearing: number;
		/** Pitch (tilt) in degrees */
		pitch: number;
	};

	interface Props {
		children?: import("svelte").Snippet;
		styles?: {
			light?: MapStyleOption;
			dark?: MapStyleOption;
		};
		theme?: "light" | "dark";
		/** Map projection type. Use `{ type: "globe" }` for 3D globe view. */
		projection?: MapLibreGL.ProjectionSpecification;
		center?: [number, number];
		zoom?: number;
		options?: Omit<MapLibreGL.MapOptions, "container" | "style">;
		/**
		 * Controlled viewport. When provided with onViewportChange,
		 * the map becomes controlled and viewport is driven by this prop.
		 */
		viewport?: Partial<MapViewport>;
		/**
		 * Callback fired continuously as the viewport changes (pan, zoom, rotate, pitch).
		 * Can be used standalone to observe changes, or with `viewport` prop
		 * to enable controlled mode where the map viewport is driven by your state.
		 */
		onviewportchange?: (viewport: MapViewport) => void;
	}

	const defaultStyles = {
		dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
		light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
	};

	let {
		children,
		styles,
		theme: _theme = "light",
		projection,
		center = [13.405, 52.52],
		zoom = 0,
		options = {},
		viewport,
		onviewportchange,
	}: Props = $props();

	let mapContainer: HTMLDivElement;
	let map: MapLibreGL.Map | null = $state(null);
	let isMounted = $state(false);
	let isLoaded = $state(false);
	let isStyleLoaded = $state(false);
	let isInteracting = $state(false);
	let initialStyleApplied = false;
	let initialCenterZoomApplied = false;
	let styleTimeoutId: ReturnType<typeof setTimeout> | null = null;
	let internalUpdate = false;

	const isControlled = $derived(viewport !== undefined && onviewportchange !== undefined);

	function getViewport(mapInstance: MapLibreGL.Map): MapViewport {
		const c = mapInstance.getCenter();
		return {
			center: [c.lng, c.lat],
			zoom: mapInstance.getZoom(),
			bearing: mapInstance.getBearing(),
			pitch: mapInstance.getPitch(),
		};
	}

	const mapStyles = $derived({
		dark: styles?.dark ?? defaultStyles.dark,
		light: styles?.light ?? defaultStyles.light,
	});

	const currentStyle = $derived(tailwindTheme === "light" ? mapStyles.light : mapStyles.dark);

	const isReady = $derived(isMounted && isLoaded && isStyleLoaded);

	setContext("map", {
		getMap: () => map,
		isLoaded: () => isReady,
	});

	function clearStyleTimeout() {
		if (styleTimeoutId) {
			clearTimeout(styleTimeoutId);
			styleTimeoutId = null;
		}
	}

	onMount(() => {
		isMounted = true;

		if (browser) {
			// Watch for document class changes (e.g., next-themes toggling dark class)
			const updateTheme = () => {
				const docTheme = getDocumentTheme();
				// Only use document theme if set, otherwise fall back to system preference
				tailwindTheme = docTheme ?? getSystemTheme();
			};

			updateTheme();

			const observer = new MutationObserver(updateTheme);
			observer.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ["class"],
			});

			// Also watch for system preference changes
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			const handleSystemChange = (e: MediaQueryListEvent) => {
				// Only use system preference if no document class is set
				if (!getDocumentTheme()) {
					tailwindTheme = e.matches ? "dark" : "light";
				}
			};
			mediaQuery.addEventListener("change", handleSystemChange);

			onDestroy(() => {
				observer.disconnect();
				mediaQuery.removeEventListener("change", handleSystemChange);
			});
		}

		const mapInstance = new MapLibreGL.Map({
			container: mapContainer,
			style: currentStyle,
			renderWorldCopies: false,
			attributionControl: {
				compact: true,
			},
			center: viewport?.center ?? center,
			zoom: viewport?.zoom ?? zoom,
			bearing: viewport?.bearing ?? 0,
			pitch: viewport?.pitch ?? 0,
			...options,
		});

		const styleDataHandler = () => {
			clearStyleTimeout();
			// Delay to ensure style is fully processed before allowing layer operations
			// This is a workaround to avoid race conditions with the style loading
			// else we have to force update every layer on setStyle change
			styleTimeoutId = setTimeout(() => {
				isStyleLoaded = true;
				if (!initialStyleApplied) {
					initialStyleApplied = true;
				}
				if (projection) {
					mapInstance.setProjection(projection);
				}
			}, 100);
		};

		const loadHandler = () => {
			isLoaded = true;
		};

		// Viewport change handler - skip if triggered by internal update
		const handleMove = () => {
			if (internalUpdate) return;
			onviewportchange?.(getViewport(mapInstance));
		};

		mapInstance.on("load", loadHandler);
		mapInstance.on("styledata", styleDataHandler);
		mapInstance.on("move", handleMove);

		mapInstance.on("dragstart", () => (isInteracting = true));
		mapInstance.on("dragend", () => (isInteracting = false));
		mapInstance.on("zoomstart", () => (isInteracting = true));
		mapInstance.on("zoomend", () => (isInteracting = false));
		mapInstance.on("rotatestart", () => (isInteracting = true));
		mapInstance.on("rotateend", () => (isInteracting = false));
		mapInstance.on("pitchstart", () => (isInteracting = true));
		mapInstance.on("pitchend", () => (isInteracting = false));

		map = mapInstance;
	});

	// Sync controlled viewport to map
	$effect(() => {
		if (!map || !isControlled || !viewport) return;
		if (map.isMoving()) return;

		const current = getViewport(map);
		const next = {
			center: viewport.center ?? current.center,
			zoom: viewport.zoom ?? current.zoom,
			bearing: viewport.bearing ?? current.bearing,
			pitch: viewport.pitch ?? current.pitch,
		};

		if (
			next.center[0] === current.center[0] &&
			next.center[1] === current.center[1] &&
			next.zoom === current.zoom &&
			next.bearing === current.bearing &&
			next.pitch === current.pitch
		) {
			return;
		}

		internalUpdate = true;
		map!.once("moveend", () => {
			internalUpdate = false;
		});
		map.jumpTo(next);
	});

	$effect(() => {
		const style = currentStyle;

		if (!map || !initialStyleApplied) {
			return;
		}

		untrack(() => {
			const currCenter = map!.getCenter();
			const currZoom = map!.getZoom();
			const currBearing = map!.getBearing();
			const currPitch = map!.getPitch();

			isStyleLoaded = false;
			map!.setStyle(style, { diff: true });

			map!.once("styledata", () => {
				map!.jumpTo({
					center: currCenter,
					zoom: currZoom,
					bearing: currBearing,
					pitch: currPitch,
				});
			});
		});
	});

	$effect(() => {
		if (!map || !isReady || isInteracting || initialCenterZoomApplied || isControlled) {
			return;
		}

		// Only apply initial center/zoom once, then let user move freely
		// Skip if controlled mode is enabled
		initialCenterZoomApplied = true;

		const [lng, lat] = center;

		untrack(() => {
			map!.easeTo({ center: [lng, lat], zoom });
		});
	});

	onDestroy(() => {
		map?.remove();
		map = null;
		isLoaded = false;
		isStyleLoaded = false;
	});
</script>

<div bind:this={mapContainer} class="relative h-full w-full">
	{#if !isReady}
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="flex gap-1">
				<span class="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full"></span>
				<span
					class="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:150ms]"
				></span>
				<span
					class="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:300ms]"
				></span>
			</div>
		</div>
	{/if}
	{#if isReady}
		{@render children?.()}
	{/if}
</div>
