<script lang="ts">
	import { onMount, onDestroy, setContext, untrack } from "svelte";
	import MapLibreGL from "maplibre-gl";
	import "maplibre-gl/dist/maplibre-gl.css";
	import { browser } from "$app/environment";

	type MapStyleOption = string | MapLibreGL.StyleSpecification;
	type Theme = "light" | "dark";

	// Check document class for theme (works with next-themes, etc.)
	function getDocumentTheme(): Theme | null {
		if (typeof document === "undefined") return null;
		if (document.documentElement.classList.contains("dark")) return "dark";
		if (document.documentElement.classList.contains("light")) return "light";
		return null;
	}

	// Get system preference
	function getSystemTheme(): Theme {
		if (typeof window === "undefined") return "light";
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}

	interface Props {
		children?: import("svelte").Snippet;
		/**
		 * Theme for the map. If not provided, automatically detects system preference.
		 * Pass your theme value here.
		 */
		theme?: Theme;
		/** Custom map styles for light and dark themes. Overrides the default Carto styles. */
		styles?: {
			light?: MapStyleOption;
			dark?: MapStyleOption;
		};
		/** Map projection type. Use `{ type: "globe" }` for 3D globe view. */
		projection?: MapLibreGL.ProjectionSpecification;
		center?: [number, number];
		zoom?: number;
		options?: Omit<MapLibreGL.MapOptions, "container" | "style">;
	}

	const defaultStyles = {
		dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
		light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
	};

	let {
		children,
		theme: themeProp,
		styles,
		projection,
		center = [13.405, 52.52],
		zoom = 0,
		options = {},
	}: Props = $props();

	let mapContainer: HTMLDivElement;
	let map: MapLibreGL.Map | null = $state(null);
	let isMounted = $state(false);
	let isLoaded = $state(false);
	let isStyleLoaded = $state(false);
	let currentStyleRef: MapStyleOption | null = $state(null);
	let styleTimeoutId: ReturnType<typeof setTimeout> | null = null;

	let detectedTheme: Theme = $state(untrack(() => getDocumentTheme() ?? getSystemTheme()));

	// Resolve theme: use prop if provided, otherwise detect from document or system
	const resolvedTheme = $derived(themeProp ?? detectedTheme);

	const mapStyles = $derived({
		dark: styles?.dark ?? defaultStyles.dark,
		light: styles?.light ?? defaultStyles.light,
	});

	const currentStyle = $derived(resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light);

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

		if (browser && !themeProp) {
			const root = document.documentElement;

			const updateTheme = () => {
				const docTheme = getDocumentTheme();
				if (docTheme) {
					detectedTheme = docTheme;
				}
			};

			updateTheme();

			// Watch for document class changes (e.g., next-themes toggling dark class)
			const observer = new MutationObserver(updateTheme);
			observer.observe(root, {
				attributes: true,
				attributeFilter: ["class"],
			});

			// Also watch for system preference changes
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			const handleSystemChange = (e: MediaQueryListEvent) => {
				// Only use system preference if no document class is set
				if (!getDocumentTheme()) {
					detectedTheme = e.matches ? "dark" : "light";
				}
			};
			mediaQuery.addEventListener("change", handleSystemChange);

			onDestroy(() => {
				observer.disconnect();
				mediaQuery.removeEventListener("change", handleSystemChange);
			});
		}

		const initialStyle = currentStyle;
		currentStyleRef = initialStyle;

		const mapInstance = new MapLibreGL.Map({
			container: mapContainer,
			style: initialStyle,
			renderWorldCopies: false,
			attributionControl: {
				compact: true,
			},
			center,
			zoom,
			...options,
		});

		const styleDataHandler = () => {
			clearStyleTimeout();
			// Delay to ensure style is fully processed before allowing layer operations
			// This is a workaround to avoid race conditions with the style loading
			// else we have to force update every layer on setStyle change
			styleTimeoutId = setTimeout(() => {
				isStyleLoaded = true;
				if (projection) {
					mapInstance.setProjection(projection);
				}
			}, 100);
		};

		const loadHandler = () => {
			isLoaded = true;
		};

		mapInstance.on("load", loadHandler);
		mapInstance.on("styledata", styleDataHandler);

		map = mapInstance;
	});

	// Effect to update style when theme changes
	$effect(() => {
		if (!map || !resolvedTheme) return;

		const newStyle = currentStyle;

		if (currentStyleRef === newStyle) return;

		clearStyleTimeout();
		currentStyleRef = newStyle;
		isStyleLoaded = false;

		untrack(() => {
			map!.setStyle(newStyle, { diff: true });
		});
	});

	$effect(() => {
		if (!map || !isReady) {
			return;
		}

		const [lng, lat] = center;

		untrack(() => {
			map!.easeTo({ center: [lng, lat], zoom });
		});
	});

	onDestroy(() => {
		clearStyleTimeout();
		map?.remove();
		map = null;
		isLoaded = false;
		isStyleLoaded = false;
		currentStyleRef = null;
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
