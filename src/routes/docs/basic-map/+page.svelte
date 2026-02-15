<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import DocsLink from "$lib/components/docs/DocsLink.svelte";
	import { ComponentPreview } from "$lib/components/docs/preview";
	import BasicMapExample from "$lib/components/docs/preview/examples/BasicMapExample.svelte";
	import ControlledMapExample from "$lib/components/docs/preview/examples/ControlledMapExample.svelte";
	import CustomStyleExample from "$lib/components/docs/preview/examples/CustomStyleExample.svelte";
	import { page } from "$app/state";

	const basicMapSource = $derived(page.data.basicMapSource);
	const basicMapHighlighted = $derived(page.data.basicMapHighlighted);

	const controlledMapFiles = $derived(page.data.controlledMapFiles);
	const customStyleFiles = $derived(page.data.customStyleFiles);
</script>

<svelte:head>
	<title>Map - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="Map"
	description="The simplest way to add an interactive map to your application."
	pathname="/docs/basic-map"
>
	<DocsSection title="Basic Usage">
		<p>
			The
			<DocsCode>Map</DocsCode>
			component handles MapLibre GL setup, theming, and provides context for child components.
		</p>
	</DocsSection>

	<ComponentPreview code={basicMapSource} highlightedCode={basicMapHighlighted}>
		<BasicMapExample />
	</ComponentPreview>

	<DocsSection title="Controlled Mode">
		<p>
			Monitor the map's viewport state in real-time. This is useful when you need to sync the map
			state with your application or respond to viewport changes. The example below shows live
			coordinates, zoom, bearing, and pitch as you interact with the map.
		</p>
	</DocsSection>

	<ComponentPreview files={controlledMapFiles}>
		<ControlledMapExample />
	</ComponentPreview>

	<DocsSection title="Custom Styles">
		<p>
			Use the
			<DocsCode>styles</DocsCode>
			prop to provide custom map styles. This example uses free vector tiles from
			<DocsLink href="https://openfreemap.org" external>OpenFreeMap</DocsLink>, an open-source
			project, the data comes from OpenStreetMap.
		</p>
	</DocsSection>

	<ComponentPreview files={customStyleFiles}>
		<CustomStyleExample />
	</ComponentPreview>
</DocsLayout>
