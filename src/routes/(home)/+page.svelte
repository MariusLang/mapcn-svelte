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
		<section class="relative w-full py-16 md:py-24 lg:pt-26 lg:pb-24">
			<Hero />
		</section>

		<section class="animate-fade-in animate-stagger container-wide px-6 pt-4" style="--stagger: 4">
			<ExamplesGrid />
		</section>
	</main>

	<Footer />
</div>
