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

	<main class="min-w-0 flex-1">
		<Hero />

		<section class="animate-fade-up animate-stagger relative" style="--stagger: 4.5">
			<div
				class="relative h-[34rem] overflow-hidden mask-b-from-65% max-md:mask-r-from-85% max-md:mask-l-from-85% md:h-[44rem] lg:h-[clamp(52rem,calc(100svh-28.5rem),90rem)]"
			>
				<MapWall />
			</div>
			<p class="text-muted-foreground absolute inset-x-0 bottom-4 container text-right text-xs">
				Map data ©
				<a href="https://www.openstreetmap.org/copyright" class="hover:text-foreground"
					>OpenStreetMap</a
				>
				contributors · ©
				<a href="https://carto.com/attributions" class="hover:text-foreground">CARTO</a>
			</p>
		</section>
	</main>

	<Footer class="mt-0!" />
</div>
