<script lang="ts">
	import ChevronLeft from "@lucide/svelte/icons/chevron-left";
	import { Button } from "$lib/registry/ui/button";
	import BlockCard from "$lib/components/blocks/BlockCard.svelte";
	import BlockDisplay from "$lib/components/blocks/BlockDisplay.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import PageHeader from "$lib/components/PageHeader.svelte";
	import PageHeaderDescription from "$lib/components/PageHeaderDescription.svelte";
	import PageHeaderHeading from "$lib/components/PageHeaderHeading.svelte";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();
	const title = $derived(data.block.title ?? data.block.name);
</script>

<svelte:head>
	<title>{title} - mapcn-svelte</title>
	<meta name="description" content={data.block.description ?? title} />
</svelte:head>

<Header />
<PageHeader align="left" size="sm" class="pb-8 md:pb-10">
	<Button
		href="/blocks"
		variant="ghost"
		size="sm"
		class="text-muted-foreground hover:text-foreground -ml-2.5 w-fit gap-1 hover:bg-transparent!"
	>
		<ChevronLeft /> All Blocks
	</Button>
	<PageHeaderHeading>{title}</PageHeaderHeading>
	{#if data.block.description}
		<PageHeaderDescription class="max-w-4xl">{data.block.description}</PageHeaderDescription>
	{/if}
</PageHeader>

<section class="container space-y-20 pb-24" aria-label={title}>
	{#key data.block.name}
		<BlockDisplay block={data.block} tree={data.tree} highlightedFiles={data.highlightedFiles} />
	{/key}
	{#if data.neighbours.length > 0}
		<section aria-labelledby="more-blocks" class="space-y-6">
			<h2 id="more-blocks" class="text-foreground text-lg font-medium tracking-tight">
				More blocks
			</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each data.neighbours as block (block.name)}
					<BlockCard {block} />
				{/each}
			</div>
		</section>
	{/if}
</section>
<Footer />
