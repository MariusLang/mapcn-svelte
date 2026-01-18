<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import DocsLink from "$lib/components/docs/DocsLink.svelte";
	import { ComponentPreview } from "$lib/components/docs/preview";
	import RouteExample from "$lib/components/docs/preview/examples/RouteExample.svelte";
	import OsrmRouteExample from "$lib/components/docs/preview/examples/OsrmRouteExample.svelte";
	import { page } from "$app/state";

	const routeSource = $derived(page.data.routeSource);
	const routeHighlighted = $derived(page.data.routeHighlighted);
	const osrmRouteSource = $derived(page.data.osrmRouteSource);
	const osrmRouteHighlighted = $derived(page.data.osrmRouteHighlighted);
</script>

<svelte:head>
	<title>Routes - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="Routes"
	description="Draw lines and paths connecting coordinates on the map."
	prev={{ title: "Popups", href: "/docs/popups" }}
>
	<DocsSection>
		<p>
			Use
			<DocsCode>MapRoute</DocsCode>
			to draw lines connecting a series of coordinates. Perfect for showing directions, trails, or any
			path between points.
		</p>
	</DocsSection>

	<DocsSection title="Basic Route">
		<p>Draw a route with numbered stop markers along the path.</p>
	</DocsSection>

	<ComponentPreview code={routeSource} highlightedCode={routeHighlighted}>
		<RouteExample />
	</ComponentPreview>

	<DocsSection title="Route Planning">
		<p>
			Display multiple route options and let users select between them. This example fetches real
			driving directions from the <DocsLink href="https://project-osrm.org/" external>
				OSRM API
			</DocsLink>. Click on a route or use the buttons to switch.
		</p>
	</DocsSection>

	<ComponentPreview code={osrmRouteSource} highlightedCode={osrmRouteHighlighted}>
		<OsrmRouteExample />
	</ComponentPreview>
</DocsLayout>
