<script lang="ts">
	import { page } from "$app/state";
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import { ComponentPreview } from "$lib/components/docs/preview";
	import MapControlsExample from "$lib/components/docs/preview/examples/MapControlsExample.svelte";

	const controlsSource = $derived(page.data.basicMapSource);
	const controlsHighlighted = $derived(page.data.controlsHighlighted);
</script>

<svelte:head>
	<title>Controls - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="Controls"
	description="Add interactive controls to your map for zoom, compass, location, and fullscreen."
	prev={{ title: "Map", href: "/docs/basic-map" }}
	next={{ title: "Markers", href: "/docs/markers" }}
>
	<DocsSection>
		<p>
			The
			<DocsCode>MapControls</DocsCode>
			component provides a set of interactive controls that can be positioned on any corner of the map.
		</p>
	</DocsSection>

	<ComponentPreview code={controlsSource} highlightedCode={controlsHighlighted}>
		<MapControlsExample />
	</ComponentPreview>
</DocsLayout>
