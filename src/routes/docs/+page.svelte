<script lang="ts">
	import { page } from "$app/state";
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsLink from "$lib/components/docs/DocsLink.svelte";
	import { ComponentPreview } from "$lib/components/docs/preview";
	import RouteExample from "$lib/components/docs/preview/examples/RouteExample.svelte";
	import OsrmRouteExample from "$lib/components/docs/preview/examples/OsrmRouteExample.svelte";

	const routeSource = $derived(page.data.routeSource);
	const routeHighlighted = $derived(page.data.routeHighlighted);

	const osrmRouteSource = $derived(page.data.osrmRouteSource);
	const osrmRouteHighlighted = $derived(page.data.osrmRouteHighlighted);
</script>

<svelte:head>
	<title>Getting Started - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="Getting Started"
	description="Beautiful, customizable map components for Svelte applications."
	next={{ title: "Installation", href: "/docs/installation" }}
>
	<DocsSection>
		<p>
			mapcn is a collection of map components built on top of
			<DocsLink href="https://maplibre.org" external>MapLibre GL JS</DocsLink>
			and styled with
			<DocsLink href="https://tailwindcss.com" external>Tailwind CSS</DocsLink>. It integrates
			seamlessly with
			<DocsLink href="https://www.shadcn-svelte.com" external>shadcn-svelte</DocsLink>.
		</p>
	</DocsSection>

	<DocsSection title="Features">
		<ul class="list-inside list-disc space-y-2">
			<li>Interactive maps with zoom, pan, and rotation</li>
			<li>Customizable markers with labels, popups, and tooltips</li>
			<li>Route drawing for paths and directions</li>
			<li>Automatic light/dark theme switching</li>
			<li>Built-in controls for zoom, compass, and geolocation</li>
			<li>No API key required - uses free CARTO basemap tiles</li>
		</ul>
	</DocsSection>

	<DocsSection title="Basic Route">
		<p>Draw a route with numbered stop markers along the path.</p>
	</DocsSection>

	<ComponentPreview code={routeSource} highlightedCode={routeHighlighted}>
		<RouteExample />
	</ComponentPreview>

	<DocsSection title="Dynamic Route from OSRM">
		<p>Fetch real driving directions from the OSRM API and display them on the map.</p>
	</DocsSection>

	<ComponentPreview code={osrmRouteSource} highlightedCode={osrmRouteHighlighted}>
		<OsrmRouteExample />
	</ComponentPreview>

	<DocsSection title="Quick Start">
		<p>
			Head to the <DocsLink href="/docs/installation">Installation</DocsLink> guide to add mapcn to your
			project, then explore the examples to see what's possible.
		</p>
	</DocsSection>
</DocsLayout>
