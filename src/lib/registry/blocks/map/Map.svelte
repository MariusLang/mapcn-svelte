<script lang="ts">
	import { onMount, onDestroy, setContext, untrack } from "svelte";
	import MapLibreGL from "maplibre-gl";
	import "maplibre-gl/dist/maplibre-gl.css";
	import { browser } from "$app/environment";

	let tailwindTheme: "light" | "dark" = $state("light");

	type MapStyleOption = string | MapLibreGL.StyleSpecification;

	interface Props {
		children?: import("svelte").Snippet;
		styles?: {
			light?: MapStyleOption;
			dark?: MapStyleOption;
		};
		theme?: "light" | "dark";
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
		styles,
		theme: _theme = "light",
		center = [13.405, 52.52],
		zoom = 11,
		options = {},
	}: Props = $props();

	let mapContainer: HTMLDivElement;
	let map: MapLibreGL.Map | null = $state(null);
	let isMounted = $state(false);
	let isLoaded = $state(false);
	let isStyleLoaded = $state(false);
	let initialStyleApplied = false;

	const mapStyles = $derived({
		dark: styles?.dark ?? defaultStyles.dark,
		light: styles?.light ?? defaultStyles.light,
	});

	const currentStyle = $derived(tailwindTheme === "dark" ? mapStyles.dark : mapStyles.light);

	const isReady = $derived(isMounted && isLoaded && isStyleLoaded);

	setContext("map", {
		getMap: () => map,
		isLoaded: () => isReady,
	});

	onMount(() => {
		isMounted = true;

		if (browser) {
			const root = document.documentElement;

			const updateTheme = () => {
				tailwindTheme = root.classList.contains("dark") ? "dark" : "light";
			};

			updateTheme();

			const observer = new MutationObserver(updateTheme);
			observer.observe(root, {
				attributes: true,
				attributeFilter: ["class"],
			});

			onDestroy(() => observer.disconnect());
		}

		const mapInstance = new MapLibreGL.Map({
			container: mapContainer,
			style: currentStyle,
			center,
			zoom,
			attributionControl: false,
			...options,
		});

		mapInstance.on("load", () => {
			isLoaded = true;
		});

		mapInstance.on("styledata", () => {
			isStyleLoaded = true;
			initialStyleApplied = true;
		});

		map = mapInstance;
	});

	$effect(() => {
		const style = currentStyle;

		if (!map || !initialStyleApplied) {
			return;
		}

		untrack(() => {
			isStyleLoaded = false;
			map!.setStyle(style, { diff: true });
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
