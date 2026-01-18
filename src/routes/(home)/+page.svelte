<script lang="ts">
	import Header from "$lib/components/Header.svelte";
	import ExamplesGrid from "$lib/components/Examples.svelte";
	import Hero from "$lib/components/Hero.svelte";
</script>

<svelte:head>
	<title>mapcn - Map components for Svelte</title>
</svelte:head>

<div class="flex flex-col pb-28">
	<Header class="border-b border-transparent" />

	<main class="mx-auto w-full flex-1 py-16">
		<Hero />
		<ExamplesGrid />
	</main>
</div>
