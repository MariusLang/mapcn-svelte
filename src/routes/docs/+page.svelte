<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsLink from "$lib/components/docs/DocsLink.svelte";

	import Zap from "@lucide/svelte/icons/zap";
	import Moon from "@lucide/svelte/icons/moon";
	import Puzzle from "@lucide/svelte/icons/puzzle";
	import Code from "@lucide/svelte/icons/code";
	import Box from "@lucide/svelte/icons/box";
	import Layers from "@lucide/svelte/icons/layers";

	const features = [
		{
			icon: Zap,
			title: "Zero Config",
			description: "Works out of the box with free map tiles. No API keys needed.",
		},
		{
			icon: Moon,
			title: "Theme Aware",
			description: "Automatically switches between light and dark map styles.",
		},
		{
			icon: Puzzle,
			title: "Composable",
			description: "Build complex UIs with simple, composable components.",
		},
		{
			icon: Code,
			title: "TypeScript",
			description: "Full type safety with comprehensive TypeScript support.",
		},
		{
			icon: Box,
			title: "Copy & Paste",
			description: "Own your code. No dependencies, just copy into your project.",
		},
		{
			icon: Layers,
			title: "Any Map Style",
			description: "Use any MapLibre-compatible tiles: MapTiler, Carto, OpenStreetMap, and more.",
		},
	];
</script>

<svelte:head>
	<title>Introduction - mapcn-svelte</title>
</svelte:head>
<DocsLayout
	title="Introduction"
	description="Beautiful, accessible map components."
	pathname="/docs"
>
	<DocsSection>
		<p>
			<strong>mapcn-svelte</strong> provides beautifully designed, accessible, and customizable map
			components. Built on
			<DocsLink href="https://maplibre.org" external>MapLibre GL</DocsLink>
			, styled with
			<DocsLink href="https://tailwindcss.com" external>Tailwind CSS</DocsLink>
			, and designed to work with
			<DocsLink href="https://shadcn-svelte.com" external>shadcn-svelte</DocsLink>
			.
		</p>
	</DocsSection>

	<DocsSection title="Why mapcn-svelte?">
		<p>
			There&apos;s no proper copy-paste, easy-to-use map integration for Svelte. Most solutions
			require complex configurations, API keys, or heavy wrapper libraries. mapcn solves this:
		</p>
		<ul>
			<li>
				<strong class="text-foreground">One Command:</strong> Run the install, get a working map. No config
				files, no API keys, no setup.
			</li>
			<li>
				<strong class="text-foreground">Own Your Code:</strong> Copy the components into your project.
				Modify anything.
			</li>
			<li>
				<strong class="text-foreground">No Wrapper Overhead:</strong>
				Built directly on MapLibre. Drop to the raw API whenever you need.
			</li>
			<li>
				<strong class="text-foreground">Looks Good Already:</strong>
				Thoughtful defaults with dark mode. Style with Tailwind as needed.
			</li>
			<li>
				<strong class="text-foreground">Works Anywhere:</strong> Bring your own tiles — MapTiler, Carto,
				OSM, or any MapLibre-compatible source.
			</li>
		</ul>
	</DocsSection>

	<DocsSection title="Why MapLibre Directly?">
		<p>
			mapcn-svelte uses
			<DocsLink href="https://maplibre.org" external>MapLibre</DocsLink>
			directly instead of wrapper libraries like
			<DocsLink href="https://github.com/MIERUNE/svelte-maplibre-gl" external
				>svelte-maplibre-gl</DocsLink
			>
			. This keeps components close to the underlying API — when you copy a mapcn-svelte component, you
			fully own the map instance without extra framework dependencies.
		</p>
		<p>
			UI elements like markers, popups, and tooltips are rendered via Svelte portals, giving you
			complete styling freedom. You can drop down to raw MapLibre APIs anytime without
			&quot;escaping&quot; a wrapper.
		</p>
	</DocsSection>

	<DocsSection title="Any Map Style">
		<p>
			mapcn-svelte works with any
			<DocsLink href="https://maplibre.org/maplibre-style-spec/" external>
				MapLibre-compatible tiles
			</DocsLink>
			. This means you can use tiles from virtually any provider:
		</p>
		<ul>
			<li>
				<DocsLink href="https://www.maptiler.com" external>MapTiler</DocsLink>
				- Beautiful vector tiles with extensive customization options
			</li>
			<li>
				<DocsLink href="https://carto.com/basemaps" external>Carto</DocsLink>
				- Clean, minimal basemaps perfect for data visualization
			</li>
			<li>
				<DocsLink href="https://www.openstreetmap.org" external>OpenStreetMap</DocsLink>
				- Community-driven, open-source map data
			</li>
			<li>
				<DocsLink href="https://stadiamaps.com" external>Stadia Maps</DocsLink>
				- Fast, reliable tile hosting with multiple styles
			</li>
			<li>
				<DocsLink href="https://www.thunderforest.com" external>Thunderforest</DocsLink>
				- Specialized maps for outdoors, cycling, and transport
			</li>
			<li>And any other provider that supports the MapLibre style spec</li>
		</ul>
	</DocsSection>

	<DocsSection title="Features">
		<div class="not-prose mt-4 grid gap-4 sm:grid-cols-2">
			{#each features as feature}
				<div class="bg-card space-y-2 rounded-lg border p-4">
					<div class="flex items-center gap-2">
						<div class="bg-primary/10 flex size-8 items-center justify-center rounded-md">
							<feature.icon class="text-primary size-4" />
						</div>
						<h3 class="text-foreground font-medium">{feature.title}</h3>
					</div>
					<p class="text-muted-foreground text-sm">
						{feature.description}
					</p>
				</div>
			{/each}
		</div>
	</DocsSection>
</DocsLayout>
