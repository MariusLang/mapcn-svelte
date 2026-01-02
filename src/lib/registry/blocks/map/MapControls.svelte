<script lang="ts">
	import { getContext } from "svelte";
	import MapLibreGL from "maplibre-gl";
	import { cn } from "$lib/utils.js";
	import Plus from "@lucide/svelte/icons/plus";
	import Minus from "@lucide/svelte/icons/minus";
	import Locate from "@lucide/svelte/icons/locate";
	import Maximize from "@lucide/svelte/icons/maximize";
	import Loader2 from "@lucide/svelte/icons/loader-2";

	interface Props {
		position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
		showZoom?: boolean;
		showCompass?: boolean;
		showLocate?: boolean;
		showFullscreen?: boolean;
		class?: string;
		onlocate?: (coords: { longitude: number; latitude: number }) => void;
	}

	let {
		position = "bottom-right",
		showZoom = true,
		showCompass = false,
		showLocate = false,
		showFullscreen = false,
		class: className,
		onlocate,
	}: Props = $props();

	const mapCtx = getContext<{
		getMap: () => MapLibreGL.Map | null;
		isLoaded: () => boolean;
	}>("map");

	let waitingForLocation = $state(false);
	let compassElement: SVGSVGElement | null = $state(null);

	const positionClasses = {
		"top-left": "top-2 left-2",
		"top-right": "top-2 right-2",
		"bottom-left": "bottom-2 left-2",
		"bottom-right": "bottom-2 right-2",
	};

	// Update compass rotation
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isLoaded();

		if (!loaded || !map || !compassElement) return;

		const updateRotation = () => {
			if (!compassElement) return;
			const bearing = map.getBearing();
			const pitch = map.getPitch();
			compassElement.style.transform = `rotateX(${pitch}deg) rotateZ(${-bearing}deg)`;
		};

		map.on("rotate", updateRotation);
		map.on("pitch", updateRotation);
		updateRotation();

		return () => {
			map.off("rotate", updateRotation);
			map.off("pitch", updateRotation);
		};
	});

	function handleZoomIn() {
		const map = mapCtx.getMap();
		map?.zoomTo(map.getZoom() + 1, { duration: 300 });
	}

	function handleZoomOut() {
		const map = mapCtx.getMap();
		map?.zoomTo(map.getZoom() - 1, { duration: 300 });
	}

	function handleResetBearing() {
		const map = mapCtx.getMap();
		map?.resetNorthPitch({ duration: 300 });
	}

	function handleLocate() {
		const map = mapCtx.getMap();
		if (!map) return;

		waitingForLocation = true;

		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const coords = {
						longitude: position.coords.longitude,
						latitude: position.coords.latitude,
					};
					map.flyTo({
						center: [coords.longitude, coords.latitude],
						zoom: 14,
						duration: 1500,
					});
					onlocate?.(coords);
					waitingForLocation = false;
				},
				(error) => {
					console.error("Error getting location:", error);
					waitingForLocation = false;
				}
			);
		}
	}

	function handleFullscreen() {
		const map = mapCtx.getMap();
		const container = map?.getContainer();
		if (!container) return;

		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			container.requestFullscreen();
		}
	}
</script>

{#if mapCtx.isLoaded()}
	<div class={cn("absolute z-10 flex flex-col gap-1.5", positionClasses[position], className)}>
		{#if showZoom}
			<div
				class="border-border bg-background [&>button:not(:last-child)]:border-border flex flex-col overflow-hidden rounded-md border shadow-sm [&>button:not(:last-child)]:border-b"
			>
				<button
					onclick={handleZoomIn}
					aria-label="Zoom in"
					type="button"
					class="hover:bg-accent dark:hover:bg-accent/40 flex size-8 items-center justify-center transition-colors"
				>
					<Plus class="size-4" />
				</button>
				<button
					onclick={handleZoomOut}
					aria-label="Zoom out"
					type="button"
					class="hover:bg-accent dark:hover:bg-accent/40 flex size-8 items-center justify-center transition-colors"
				>
					<Minus class="size-4" />
				</button>
			</div>
		{/if}

		{#if showCompass}
			<div
				class="border-border bg-background flex flex-col overflow-hidden rounded-md border shadow-sm"
			>
				<button
					onclick={handleResetBearing}
					aria-label="Reset bearing to north"
					type="button"
					class="hover:bg-accent flex size-8 items-center justify-center transition-colors"
				>
					<svg
						bind:this={compassElement}
						viewBox="0 0 24 24"
						class="size-5 transition-transform duration-200"
						style="transform-style: preserve-3d;"
					>
						<path d="M12 2L16 12H12V2Z" class="fill-red-500" />
						<path d="M12 2L8 12H12V2Z" class="fill-red-300" />
						<path d="M12 22L16 12H12V22Z" class="fill-muted-foreground/60" />
						<path d="M12 22L8 12H12V22Z" class="fill-muted-foreground/30" />
					</svg>
				</button>
			</div>
		{/if}

		{#if showLocate}
			<div
				class="border-border bg-background flex flex-col overflow-hidden rounded-md border shadow-sm"
			>
				<button
					onclick={handleLocate}
					aria-label="Find my location"
					type="button"
					class={cn(
						"hover:bg-accent dark:hover:bg-accent/40 flex size-8 items-center justify-center transition-colors",
						waitingForLocation && "pointer-events-none cursor-not-allowed opacity-50"
					)}
					disabled={waitingForLocation}
				>
					{#if waitingForLocation}
						<Loader2 class="size-4 animate-spin" />
					{:else}
						<Locate class="size-4" />
					{/if}
				</button>
			</div>
		{/if}

		{#if showFullscreen}
			<div
				class="border-border bg-background flex flex-col overflow-hidden rounded-md border shadow-sm"
			>
				<button
					onclick={handleFullscreen}
					aria-label="Toggle fullscreen"
					type="button"
					class="hover:bg-accent dark:hover:bg-accent/40 flex size-8 items-center justify-center transition-colors"
				>
					<Maximize class="size-4" />
				</button>
			</div>
		{/if}
	</div>
{/if}
