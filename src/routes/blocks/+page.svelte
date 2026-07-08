<script lang="ts">
	import type { PageData } from "./$types";
	import BlockDisplay from "$lib/components/blocks/BlockDisplay.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import PageHeader from "$lib/components/PageHeader.svelte";
	import PageHeaderDescription from "$lib/components/PageHeaderDescription.svelte";
	import PageHeaderHeading from "$lib/components/PageHeaderHeading.svelte";

	const { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Map blocks for your application - mapcn-svelte</title>
	<meta
		name="description"
		content="Pre-built, ready-to-use map blocks. Browse, preview, and copy them into your app with one command."
	/>
</svelte:head>

<Header />

<PageHeader align="left" size="sm">
	<PageHeaderHeading>Blocks</PageHeaderHeading>
	<PageHeaderDescription>
		Pre-built, ready-to-use map blocks. Browse, preview, and copy them into your app with one
		command.
	</PageHeaderDescription>
</PageHeader>

<!-- Blocks list -->
<section
	class="animate-fade-up animate-stagger container mb-20 scroll-mt-20 space-y-20"
	id="blocks"
	style="--stagger: 3.5"
>
	{#each data.blocksWithData as { block, tree, highlightedFiles }}
		<BlockDisplay {block} {tree} {highlightedFiles} />
	{/each}
</section>

<Footer />
