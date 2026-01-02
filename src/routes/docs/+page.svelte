<script lang="ts">
	import { page } from "$app/state";
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";

	import { ComponentPreview } from "$lib/components/docs/preview";
	import RouteExample from "$lib/components/docs/preview/examples/RouteExample.svelte";
	import OsrmRouteExample from "$lib/components/docs/preview/examples/OsrmRouteExample.svelte";

	const routeSource = $derived(page.data.routeSource);
	const routeHighlighted = $derived(page.data.routeHighlighted);

	const osrmRouteSource = $derived(page.data.osrmRouteSource);
	const osrmRouteHighlighted = $derived(page.data.osrmRouteHighlighted);
</script>

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

	<DocsSection title="Dynamic Route from OSRM">
		<p>Fetch real driving directions from the OSRM API and display them on the map.</p>
	</DocsSection>

	<ComponentPreview code={osrmRouteSource} highlightedCode={osrmRouteHighlighted}>
		<OsrmRouteExample />
	</ComponentPreview>
</DocsLayout>
