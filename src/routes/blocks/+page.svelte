<script lang="ts">
	import { onMount, tick } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { LayoutGrid, Rows2 } from "@lucide/svelte";
	import BlockCard from "$lib/components/blocks/BlockCard.svelte";
	import { cn } from "$lib/utils";
	import type { PageData } from "./$types";
	import BlockDisplay from "$lib/components/blocks/BlockDisplay.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import PageHeader from "$lib/components/PageHeader.svelte";
	import PageHeaderDescription from "$lib/components/PageHeaderDescription.svelte";
	import PageHeaderHeading from "$lib/components/PageHeaderHeading.svelte";

	const { data }: { data: PageData } = $props();

	let view = $state<"grid" | "single">("grid");
	const orderedBlocks = $derived(
		data.categories
			.flatMap((category) => category.blocks)
			.map((block) => data.blocksWithData.find((item) => item.block.name === block.name)!)
	);
	async function openBlock(name: string) {
		view = "single";
		await goto(`#${name}`, { shallow: true, replace: true, reset: false });
		await tick();
		document.getElementById(name)?.scrollIntoView({ block: "start" });
	}
	function openFromHash() {
		const name = window.location.hash.slice(1);
		if (data.blocksWithData.some(({ block }) => block.name === name)) void openBlock(name);
	}
	onMount(() => {
		openFromHash();
		window.addEventListener("hashchange", openFromHash);
		return () => window.removeEventListener("hashchange", openFromHash);
	});
	async function setView(mode: "grid" | "single") {
		view = mode;
		await goto(page.url.pathname + page.url.search, { shallow: true, replace: true, reset: false });
	}
</script>

<svelte:head>
	<title>Map blocks for your application - mapcn-svelte</title>
	<meta
		name="description"
		content="Pre-built, ready-to-use map blocks. Browse, preview, and copy them into your app with one command."
	/>
</svelte:head>

<Header />

<PageHeader align="left" size="sm" class="md:flex-row md:items-end md:justify-between">
	<div class="flex flex-col gap-3">
		<PageHeaderHeading>Blocks</PageHeaderHeading>
		<PageHeaderDescription class="max-w-4xl"
			>Ready-to-use map blocks. Browse, preview, and copy them into your app with one command.</PageHeaderDescription
		>
	</div>
	<div
		role="group"
		aria-label="Blocks layout"
		class="bg-background dark:border-input dark:bg-input/30 flex items-center gap-0.5 rounded-lg border p-0.5 shadow-xs"
	>
		{#each [{ mode: "grid", label: "Grid view", icon: LayoutGrid }, { mode: "single", label: "List view", icon: Rows2 }] as option (option.mode)}
			<button
				type="button"
				aria-label={option.label}
				aria-pressed={view === option.mode}
				onclick={() => setView(option.mode as "grid" | "single")}
				class={cn(
					"text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex size-8 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-[3px]",
					view === option.mode && "bg-accent text-foreground"
				)}><option.icon class="size-4" /></button
			>
		{/each}
	</div>
</PageHeader>

<section
	class="animate-fade-up animate-stagger container scroll-mt-20 space-y-20 pb-24"
	id="blocks"
	style="--stagger: 4"
>
	{#if view === "grid"}
		<div class="space-y-16">
			{#each data.categories as category (category.slug)}
				<section aria-labelledby={`category-${category.slug}`} class="space-y-6">
					<h2
						id={`category-${category.slug}`}
						class="text-foreground flex items-baseline gap-2 text-lg font-medium tracking-tight"
					>
						{category.title}<span class="text-muted-foreground font-mono text-sm font-normal"
							>{category.blocks.length}</span
						>
					</h2>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						{#each category.blocks as block (block.name)}<BlockCard
								{block}
								onopen={openBlock}
							/>{/each}
					</div>
				</section>
			{/each}
		</div>
	{:else}
		<div class="space-y-20">
			{#each orderedBlocks as { block, tree, highlightedFiles } (block.name)}<BlockDisplay
					{block}
					{tree}
					{highlightedFiles}
				/>{/each}
		</div>
	{/if}
</section>

<Footer />
