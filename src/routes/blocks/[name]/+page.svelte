<script lang="ts">
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
<PageHeader align="left" size="sm">
	<a href="/blocks" class="text-muted-foreground hover:text-foreground text-sm">← All blocks</a>
	<PageHeaderHeading>{title}</PageHeaderHeading>
	{#if data.block.description}
		<PageHeaderDescription>{data.block.description}</PageHeaderDescription>
	{/if}
</PageHeader>

<section class="container pb-24" aria-label={title}>
	{#key data.block.name}
		<BlockDisplay block={data.block} tree={data.tree} highlightedFiles={data.highlightedFiles} />
	{/key}
</section>
<Footer />
