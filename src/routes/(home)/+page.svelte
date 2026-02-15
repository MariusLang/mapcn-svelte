<script lang="ts">
	import Header from "$lib/components/Header.svelte";
	import ExamplesGrid from "$lib/components/home/ExamplesGrid.svelte";
	import Hero from "$lib/components/Hero.svelte";
</script>

<svelte:head>
	<title>mapcn-svelte - Beautiful maps made simple</title>
</svelte:head>

<div class="flex flex-col pb-28">
	<Header class="border-b border-transparent" />

	<main class="flex-1">
		<section class="relative w-full py-20">
			<Hero />
		</section>

		<section class="container px-6">
			<ExamplesGrid />
		</section>
	</main>
</div>
