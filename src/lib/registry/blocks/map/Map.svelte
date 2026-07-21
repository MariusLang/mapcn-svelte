<script lang="ts">
	import { onMount, onDestroy, setContext, untrack } from "svelte";
	import MapLibreGL from "maplibre-gl";
	import "maplibre-gl/dist/maplibre-gl.css";
	import { browser } from "$app/environment";
	import { cn } from "$lib/utils.js";
	import { resolveMapTheme } from "./theme";

	const blankMapStyle: MapLibreGL.StyleSpecification = {
		version: 8,
		sources: {},
		layers: [
			{
				id: "background",
				type: "background",
				paint: { "background-color": "rgba(0, 0, 0, 0)" },
			},
		],
	};

	// Check the document for an explicit theme (works with next-themes, etc.).
	// Covers both `class` and `data-theme` attributes.
	function getDocumentTheme(): "light" | "dark" | null {
		if (typeof document === "undefined") return null;
		const root = document.documentElement;
		if (root.classList.contains("dark")) return "dark";
		if (root.classList.contains("light")) return "light";
		const dataTheme = root.dataset.theme;
		if (dataTheme === "dark" || dataTheme === "light") return dataTheme;
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
		class?: string;
		styles?: {
			light?: MapStyleOption;
			dark?: MapStyleOption;
		};
		/**
		 * Use a transparent, tile-less basemap instead of the default Carto style.
		 * Useful for visualizations where child layers provide all geography.
		 * Ignored when an explicit `styles` prop is provided.
		 */
		blank?: boolean;
		theme?: "light" | "dark";
		/** Map projection type. Use `{ type: "globe" }` for 3D globe view. */
		projection?: MapLibreGL.ProjectionSpecification;
		center?: [number, number];
		zoom?: number;
		options?: Omit<MapLibreGL.MapOptions, "container" | "style">;
		/**
		 * Bindable reference to the underlying MapLibre map instance.
		 * Useful for calling map methods imperatively from the parent.
		 */
		map?: MapLibreGL.Map | null;
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
		/**
		 * Callback fired after each style load completes (initial load and subsequent style changes).
		 * Runs after any viewport restoration, so it's safe to call map methods here.
		 */
		onstyleloaded?: () => void;
		/** Show a loading indicator on top of the map. */
		loading?: boolean;
	}

	const defaultStyles = {
		dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
		light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
	};

	let {
		children,
		class: className,
		styles,
		blank = false,
		theme: explicitTheme,
		projection,
		center = [13.405, 52.52],
		zoom = 0,
		options = {},
		map = $bindable(null),
		viewport,
		onviewportchange,
		onstyleloaded,
		loading = false,
	}: Props = $props();

	let mapContainer: HTMLDivElement;
	let isMounted = $state(false);
	let isLoaded = $state(false);
	let isStyleLoaded = $state(false);
	let isInteracting = $state(false);
	let initialStyleApplied = false;
	let initialCenterZoomApplied = false;
	let pendingStyle = $state<MapStyleOption | null>(null);
	let styleSwapInFlight = false;
	let appliedStyleKey: string | null = null;
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
		dark: styles ? (styles.dark ?? defaultStyles.dark) : blank ? blankMapStyle : defaultStyles.dark,
		light: styles
			? (styles.light ?? defaultStyles.light)
			: blank
				? blankMapStyle
				: defaultStyles.light,
	});

	const resolvedTheme = $derived(resolveMapTheme({ explicitTheme, ambientTheme: tailwindTheme }));

	const currentStyle = $derived(resolvedTheme === "light" ? mapStyles.light : mapStyles.dark);
	const currentStyleKey = $derived(
		typeof currentStyle === "string" ? currentStyle : (JSON.stringify(currentStyle) ?? "")
	);

	const isReady = $derived(isMounted && isLoaded && isStyleLoaded);

	setContext("map", {
		getMap: () => map,
		isLoaded: () => isReady,
		isStyleReady: () => isReady,
		resolvedTheme: () => resolvedTheme,
	});

	onMount(() => {
		isMounted = true;

		let observer: MutationObserver | undefined;
		let mediaQuery: MediaQueryList | undefined;
		let handleSystemChange: ((e: MediaQueryListEvent) => void) | undefined;

		if (browser) {
			// Also watch for document class changes (e.g., external theme togglers)
			const updateTheme = () => {
				const docTheme = getDocumentTheme();
				// Only use document theme if set, otherwise fall back to system preference
				tailwindTheme = docTheme ?? getSystemTheme();
			};

			updateTheme();

			observer = new MutationObserver(updateTheme);
			observer.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ["class", "data-theme"],
			});

			// Also watch for system preference changes
			mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			handleSystemChange = (e: MediaQueryListEvent) => {
				// Only use system preference if no document class is set
				if (!getDocumentTheme()) {
					tailwindTheme = e.matches ? "dark" : "light";
				}
			};
			mediaQuery.addEventListener("change", handleSystemChange);
		}

		const mapInstance = new MapLibreGL.Map({
			container: mapContainer,
			style: currentStyle,
			fadeDuration: 0,
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
		appliedStyleKey = currentStyleKey;

		const styleLoadHandler = () => {
			styleSwapInFlight = false;
			isStyleLoaded = true;
			initialStyleApplied = true;
			onstyleloaded?.();
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
		mapInstance.on("style.load", styleLoadHandler);
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

		return () => {
			observer?.disconnect();
			if (mediaQuery && handleSystemChange) {
				mediaQuery.removeEventListener("change", handleSystemChange);
			}
			mapInstance.off("load", loadHandler);
			mapInstance.off("style.load", styleLoadHandler);
			mapInstance.off("move", handleMove);
			mapInstance.remove();
			map = null;
			isLoaded = false;
			isStyleLoaded = false;
		};
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
		const styleKey = currentStyleKey;

		if (!map || !initialStyleApplied || appliedStyleKey === styleKey) {
			return;
		}

		appliedStyleKey = styleKey;
		isStyleLoaded = false;
		pendingStyle = style;
	});

	$effect(() => {
		const style = pendingStyle;
		if (!map || !style) return;

		pendingStyle = null;
		const currCenter = map.getCenter();
		const currZoom = map.getZoom();
		const currBearing = map.getBearing();
		const currPitch = map.getPitch();

		styleSwapInFlight = true;
		map.setStyle(style, { diff: false });
		map.once("style.load", () => {
			map?.jumpTo({
				center: currCenter,
				zoom: currZoom,
				bearing: currBearing,
				pitch: currPitch,
			});
		});
	});

	$effect(() => {
		if (!map || !isReady || !projection || styleSwapInFlight) {
			return;
		}

		map.setProjection(projection);
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
		isLoaded = false;
		isStyleLoaded = false;
	});
</script>

<div bind:this={mapContainer} class={cn("relative h-full w-full", className)}>
	{#if !isLoaded || loading}
		<div
			class="bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs"
		>
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
	{#if map}
		{@render children?.()}
	{/if}
</div>
