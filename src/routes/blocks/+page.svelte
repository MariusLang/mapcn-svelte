<script lang="ts">
	import type { PageData } from "./$types";
	import BlockDisplay from "$lib/components/blocks/BlockDisplay.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import { Button } from "$lib/registry/ui/button/index";

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

<!-- Page header -->
<div class="relative">
	<div class="pointer-events-none absolute inset-x-0 -inset-y-10 overflow-hidden">
		<div
			class="absolute inset-0 opacity-[0.20] dark:opacity-[0.12]"
			style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 24px 24px;"
		></div>
		<div
			class="from-background to-background absolute inset-0 bg-gradient-to-b via-transparent"
		></div>
	</div>
	<section
		class="container mx-auto flex w-full max-w-6xl flex-col items-start gap-4 py-16 text-left md:py-24"
	>
		<h1
			class="animate-fade-up max-w-4xl text-4xl font-semibold tracking-tight delay-100 sm:text-5xl md:text-5xl"
		>
			<span
				class="from-foreground via-foreground to-foreground/65 bg-gradient-to-b bg-clip-text text-transparent"
			>
				Map blocks for your application
			</span>
		</h1>
		<p
			class="text-muted-foreground animate-fade-up max-w-2xl leading-relaxed delay-200 sm:text-lg md:text-xl"
		>
			Pre-built, ready-to-use map blocks. Browse, preview, and copy them into your app with one
			command.
		</p>
		<div class="animate-fade-up mt-3 flex flex-wrap items-center gap-3 delay-300">
			<Button href="#blocks">Browse Blocks</Button>
			<Button variant="outline" href="/docs">View Documentation</Button>
		</div>
	</section>
</div>

<!-- Blocks list -->
<section class="animate-fade-up container mb-20 scroll-mt-20 space-y-20 delay-400" id="blocks">
	{#each data.blocksWithData as { block, tree, highlightedFiles }}
		<BlockDisplay {block} {tree} {highlightedFiles} />
	{/each}
</section>

<Footer />
