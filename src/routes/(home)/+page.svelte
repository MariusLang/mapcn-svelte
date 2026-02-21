<script lang="ts">
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import ExamplesGrid from "$lib/components/home/ExamplesGrid.svelte";
	import Hero from "$lib/components/Hero.svelte";
</script>

<svelte:head>
	<title>mapcn-svelte - Beautiful maps made simple</title>
</svelte:head>

<div class="flex flex-col">
	<Header />

	<main class="flex-1 pb-32">
		<section class="relative w-full py-20">
			<Hero />
		</section>

		<section class="container px-6">
			<ExamplesGrid />
		</section>
	</main>

	<Footer />
</div>
