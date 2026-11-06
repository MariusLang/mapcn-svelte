<script lang="ts">
	import sizes from "./showcase-sizes.json";

	type Tile = keyof typeof sizes;

	const columns: Tile[][] = [
		["analytics-map", "route-alternatives", "heatmap", "analytics-card"],
		["logistics-network", "choropleth", "clusters", "route-alternatives"],
		["delivery-tracker", "globe", "uptime-monitor", "choropleth"],
	];
	const rails: Tile[][] = [
		["marker-popup", "geojson-overlay", "arcs", "route-progress"],
		["route", "arcs", "popup", "custom-layer"],
	];
</script>

{#snippet tile(name: Tile, eager: boolean)}
	{@const { width, height } = sizes[name]}
	<div
		class="bg-muted ring-foreground/10 overflow-hidden rounded-xl ring-1"
		style:aspect-ratio={`${width} / ${height}`}
	>
		<img
			src="/showcase/{name}-light.jpg"
			{width}
			{height}
			alt=""
			loading={eager ? "eager" : "lazy"}
			decoding="async"
			class="size-full object-cover dark:hidden"
		/>
		<img
			src="/showcase/{name}-dark.jpg"
			{width}
			{height}
			alt=""
			loading={eager ? "eager" : "lazy"}
			decoding="async"
			class="hidden size-full object-cover dark:block"
		/>
	</div>
{/snippet}

<div
	aria-hidden="true"
	class="pointer-events-none relative left-1/2 flex w-[40rem] -translate-x-1/2 gap-3 select-none md:w-[calc(100%-8rem)] md:max-w-[84rem] md:gap-4 xl:gap-6"
>
	{#each columns as column, index (index)}
		<div
			class={[
				"flex min-w-0 flex-1 flex-col gap-3 md:gap-4 xl:gap-6",
				index !== 1 && "mt-6 md:mt-8",
				index === 2 && "md:max-xl:hidden",
			]}
		>
			{#each column as name, row (row)}
				{@render tile(name, row === 0)}
			{/each}
		</div>
	{/each}
	{#each rails as rail, index (index)}
		<div
			class={[
				"absolute top-10 hidden w-60 flex-col gap-4 opacity-70 blur-[3px] md:flex",
				index === 0 ? "right-full mr-4 mask-l-from-50%" : "left-full ml-4 mask-r-from-50%",
			]}
		>
			{#each rail as name (name)}
				{@render tile(name, false)}
			{/each}
		</div>
	{/each}
</div>
