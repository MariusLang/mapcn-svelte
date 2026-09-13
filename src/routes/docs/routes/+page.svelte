<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import RouteProgressExample from "$lib/components/docs/preview/examples/RouteProgressExample.svelte";
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
	pathname="/docs/routes"
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
		<ComponentPreview code={routeSource} highlightedCode={routeHighlighted}>
			<RouteExample />
		</ComponentPreview>
	</DocsSection>

	<DocsSection title="Route Progress">
		<p>
			Pass <DocsCode>progress</DocsCode> (0 to 1) and a <DocsCode>RouteProgress</DocsCode> child paints
			the covered part of the line. <DocsCode>RouteMarker</DocsCode> pins a marker at <DocsCode
				>"start"</DocsCode
			>, <DocsCode>"end"</DocsCode>, <DocsCode>"progress"</DocsCode>, or any fraction.
		</p>
		<ComponentPreview
			code={page.data.routeProgressSource}
			highlightedCode={page.data.routeProgressHighlighted}
		>
			<RouteProgressExample />
		</ComponentPreview>
	</DocsSection>

	<DocsSection title="Route Planning">
		<p>
			Render one <DocsCode>MapRoute</DocsCode> per option and mark the selected one <DocsCode
				>active</DocsCode
			>, it moves on top and uses the <DocsCode>active*</DocsCode> styles. Click a line or a row to switch.
		</p>
		<ComponentPreview code={osrmRouteSource} highlightedCode={osrmRouteHighlighted} height="500px">
			<OsrmRouteExample />
		</ComponentPreview>
	</DocsSection>
</DocsLayout>
