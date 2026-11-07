<script lang="ts">
	import sizes from "./showcase-sizes.json";

	type Tile = keyof typeof sizes;

	const columns: Tile[][] = [
		["analytics-map", "route-alternatives", "heatmap", "analytics-card"],
		["logistics-network", "choropleth", "clusters", "route-alternatives"],
		["delivery-tracker", "globe", "store-locator", "uptime-monitor"],
	];
	const rails: Tile[][][] = [
		[
			["popup", "custom-layer", "route", "geojson-overlay", "arcs"],
			["marker-popup", "geojson-overlay", "arcs", "route-progress", "popup"],
		],
		[
			["route", "arcs", "popup", "marker-popup", "custom-layer"],
			["geojson-overlay", "route-progress", "custom-layer", "route", "marker-popup"],
		],
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
	class="pointer-events-none relative left-1/2 flex w-[40rem] -translate-x-1/2 gap-3 pt-6 select-none md:left-0 md:mx-auto md:w-[calc(100%-8rem)] md:max-w-[84rem] md:translate-x-0 md:gap-4 xl:w-[calc(100%-12rem)] xl:gap-6"
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
	{#each rails as rail, side (side)}
		<div
			class={[
				"absolute top-0 hidden transform-gpu gap-4 opacity-70 blur-[3px] md:flex xl:gap-6",
				side === 0
					? "right-full mr-4 mask-l-from-50% xl:mr-6"
					: "left-full ml-4 mask-r-from-50% xl:ml-6",
			]}
		>
			{#each rail as column, index (index)}
				<div class="flex w-60 flex-col gap-4 xl:gap-6" style:margin-top={`${[3, 6][index]}rem`}>
					{#each column as name, row (row)}
						{@render tile(name, false)}
					{/each}
				</div>
			{/each}
		</div>
	{/each}
</div>
