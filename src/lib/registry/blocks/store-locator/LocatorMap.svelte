<script lang="ts">
	import Clock from "@lucide/svelte/icons/clock";
	import MapPin from "@lucide/svelte/icons/map-pin";
	import Phone from "@lucide/svelte/icons/phone";
	import {
		Map,
		MapControls,
		MapMarker,
		MapPopup,
		MarkerContent,
		MarkerTooltip,
	} from "$lib/registry/blocks/map";
	import * as Sidebar from "$lib/registry/ui/sidebar";
	import { cn } from "$lib/utils";
	import FlyToSelected from "./FlyToSelected.svelte";
	import type { Store } from "./data";

	let {
		stores,
		selectedId,
		onselect,
		onclearselection,
		center,
	}: {
		stores: Store[];
		selectedId: string | null;
		onselect: (id: string) => void;
		onclearselection: () => void;
		center: [number, number];
	} = $props();

	const selected = $derived(stores.find((store) => store.id === selectedId));
</script>

<div class="relative h-full">
	<Sidebar.Trigger class="bg-background absolute top-3 left-3 z-10 border shadow-sm md:hidden" />

	<Map {center} zoom={12} options={{ minZoom: 10, maxZoom: 17 }}>
		<MapControls showFullscreen />
		<FlyToSelected store={selected} />

		{#each stores as store (store.id)}
			<MapMarker longitude={store.lng} latitude={store.lat} onclick={() => onselect(store.id)}>
				<MarkerContent>
					<div
						class={cn(
							"text-background flex items-center justify-center rounded-full shadow-md transition-all",
							store.id === selectedId
								? "bg-foreground/80 size-9 scale-110"
								: "bg-foreground hover:bg-muted-foreground size-7"
						)}
					>
						<MapPin class={cn(store.id === selectedId ? "size-4.5" : "size-3.5")} />
					</div>
				</MarkerContent>
				<MarkerTooltip offset={24} class="bg-foreground text-background">{store.name}</MarkerTooltip
				>
			</MapMarker>
		{/each}

		{#if selected}
			<MapPopup
				longitude={selected.lng}
				latitude={selected.lat}
				offset={26}
				closeButton
				closeOnClick={false}
				onclose={onclearselection}
				class="min-w-56"
				focusAfterOpen={false}
			>
				<p class="text-popover-foreground pr-5 font-medium">{selected.name}</p>
				<span
					class={cn(
						"mt-1 flex items-center gap-1.5 text-xs font-medium",
						selected.openNow ? "text-foreground" : "text-muted-foreground"
					)}
				>
					<span
						class={cn(
							"size-1.5 rounded-full",
							selected.openNow ? "bg-emerald-500" : "bg-neutral-500"
						)}
					></span>
					{selected.openNow ? "Open now" : "Closed"}
				</span>

				<div class="text-muted-foreground mt-2.5 space-y-1.5 text-xs tabular-nums">
					<p class="flex items-center gap-1.5">
						<MapPin class="size-3.5 shrink-0" />
						{selected.address}, {selected.neighborhood}
					</p>
					<p class="flex items-center gap-1.5">
						<Clock class="size-3.5 shrink-0" />
						{selected.hours}
					</p>
					<p class="flex items-center gap-1.5">
						<Phone class="size-3.5 shrink-0" />
						{selected.phone}
					</p>
				</div>
			</MapPopup>
		{/if}
	</Map>
</div>
