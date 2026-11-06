<script lang="ts">
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import MapWall from "$lib/components/home/MapWall.svelte";
	import Hero from "$lib/components/Hero.svelte";
</script>

<svelte:head>
	<title>mapcn-svelte - Beautiful maps made simple</title>
</svelte:head>

<div class="flex flex-col">
	<Header />

	<main class="flex-1 pb-32">
		<section class="relative w-full py-16 md:py-20 lg:py-24 lg:pb-20">
			<Hero />
		</section>

		<section
			class="animate-fade-in animate-stagger max-h-[42rem] overflow-hidden mask-b-from-75%"
			style="--stagger: 4"
		>
			<MapWall />
		</section>
	</main>

	<Footer />
</div>
