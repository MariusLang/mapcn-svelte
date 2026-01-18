<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import { ComponentPreview } from "$lib/components/docs/preview";
	import ClusterExample from "$lib/components/docs/preview/examples/ClusterExample.svelte";
	import { page } from "$app/state";

	const clusterSource = $derived(page.data.clusterSource);
	const clusterHighlighted = $derived(page.data.clusterHighlighted);
</script>

<svelte:head>
	<title>Clusters - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="Clusters"
	description="Visualize large datasets with automatic point clustering."
	prev={{ title: "Routes", href: "/docs/routes" }}
	next={{ title: "Advanced", href: "/docs/advanced" }}
>
	<DocsSection>
		<p>
			The
			<DocsCode>MapClusterLayer</DocsCode>
			component uses MapLibre's built-in clustering to efficiently render large numbers of points. Points
			are automatically grouped into clusters at low zoom levels, and expand as you zoom in.
		</p>
	</DocsSection>

	<DocsSection title="Basic Example">
		<p>Click on clusters to zoom in. Click individual points to see details in a popup.</p>
	</DocsSection>

	<ComponentPreview code={clusterSource} highlightedCode={clusterHighlighted}>
		<ClusterExample />
	</ComponentPreview>
</DocsLayout>
