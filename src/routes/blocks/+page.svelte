<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import BlockCard from "$lib/components/blocks/BlockCard.svelte";
	import type { PageData } from "./$types";
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import PageHeader from "$lib/components/PageHeader.svelte";
	import PageHeaderDescription from "$lib/components/PageHeaderDescription.svelte";
	import PageHeaderHeading from "$lib/components/PageHeaderHeading.svelte";

	const { data }: { data: PageData } = $props();

	onMount(() => {
		const name = window.location.hash.slice(1);
		if (data.categories.some(({ blocks }) => blocks.some((block) => block.name === name))) {
			void goto(`/blocks/${name}`, { replace: true });
		}
	});
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
</PageHeader>

<section
	class="animate-fade-up animate-stagger container scroll-mt-20 space-y-20 pb-24"
	id="blocks"
	style="--stagger: 4"
>
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
					{#each category.blocks as block (block.name)}<BlockCard {block} />{/each}
				</div>
			</section>
		{/each}
	</div>
</section>

<Footer />
