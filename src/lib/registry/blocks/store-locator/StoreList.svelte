<script lang="ts">
	import Clock from "@lucide/svelte/icons/clock";
	import MapPin from "@lucide/svelte/icons/map-pin";
	import Phone from "@lucide/svelte/icons/phone";
	import Search from "@lucide/svelte/icons/search";
	import { SvelteMap } from "svelte/reactivity";
	import * as Sidebar from "$lib/registry/ui/sidebar";
	import { Input } from "$lib/registry/ui/input";
	import { cn } from "$lib/utils";
	import type { Store } from "./data";

	let {
		stores,
		query = $bindable(),
		selectedId,
		onselect,
	}: {
		stores: Store[];
		query: string;
		selectedId: string | null;
		onselect: (id: string) => void;
	} = $props();

	const itemRefs = new SvelteMap<string, HTMLButtonElement>();

	function itemRef(node: HTMLButtonElement, id: string) {
		itemRefs.set(id, node);
		return {
			destroy() {
				itemRefs.delete(id);
			},
		};
	}

	$effect(() => {
		if (!selectedId) return;
		itemRefs.get(selectedId)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
	});
</script>

<Sidebar.Root collapsible="offcanvas">
	<Sidebar.Header class="gap-3 p-4">
		<div>
			<h2 class="text-foreground text-lg font-semibold tracking-tight">Find a store</h2>
			<p class="text-muted-foreground text-sm">
				{stores.length}
				{stores.length === 1 ? "location" : "locations"} near you
			</p>
		</div>
		<div class="relative">
			<Search class="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
			<Input
				bind:value={query}
				placeholder="Search name or address"
				class="bg-background pl-8"
				aria-label="Search stores"
			/>
		</div>
	</Sidebar.Header>

	<Sidebar.Separator class="mx-0" />

	<Sidebar.Content>
		{#if stores.length === 0}
			<div class="text-muted-foreground p-6 text-center text-sm">No stores match your search.</div>
		{:else}
			<Sidebar.Group class="p-2">
				<Sidebar.Menu class="gap-1">
					{#each stores as store (store.id)}
						{@const active = store.id === selectedId}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={active} class="h-auto flex-col items-stretch gap-0 p-3">
								{#snippet child({ props })}
									<button
										{...props}
										use:itemRef={store.id}
										type="button"
										onclick={() => onselect(store.id)}
										aria-current={active}
									>
										<div class="flex items-center justify-between gap-2">
											<span class="text-foreground font-medium">{store.name}</span>
											<span
												class={cn(
													"flex items-center gap-1.5 text-xs font-medium",
													store.openNow ? "text-foreground" : "text-muted-foreground"
												)}
											>
												<span
													class={cn(
														"size-1.5 rounded-full",
														store.openNow ? "bg-emerald-500" : "bg-neutral-500"
													)}
												></span>
												{store.openNow ? "Open" : "Closed"}
											</span>
										</div>

										<div
											class="text-muted-foreground mt-2 space-y-1.5 text-xs font-normal tabular-nums"
										>
											<p class="flex items-center gap-1.5">
												<MapPin class="size-3.5 shrink-0" />
												{store.address}, {store.neighborhood}
											</p>
											<p class="flex items-center gap-1.5">
												<Clock class="size-3.5 shrink-0" />
												{store.hours}
											</p>
											<p class="flex items-center gap-1.5">
												<Phone class="size-3.5 shrink-0" />
												{store.phone}
											</p>
										</div>
									</button>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.Group>
		{/if}
	</Sidebar.Content>
</Sidebar.Root>
