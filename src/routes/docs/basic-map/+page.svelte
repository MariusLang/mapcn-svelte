<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import { ComponentPreview } from "$lib/components/docs/preview";
	import BasicMapExample from "$lib/components/docs/preview/examples/BasicMapExample.svelte";
	import { page } from "$app/state";

	const basicMapSource = $derived(page.data.basicMapSource);
	const basicMapHighlighted = $derived(page.data.basicMapHighlighted);
</script>

<svelte:head>
	<title>Map - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="Map"
	description="The simplest way to add an interactive map to your application."
	prev={{ title: "API Reference", href: "/docs/api-reference" }}
	next={{ title: "Controls", href: "/docs/controls" }}
>
	<DocsSection>
		<p>
			The
			<DocsCode>Map</DocsCode>
			component handles MapLibre GL setup, theming, and provides context for child components.
		</p>
	</DocsSection>

	<ComponentPreview code={basicMapSource} highlightedCode={basicMapHighlighted}>
		<BasicMapExample />
	</ComponentPreview>
</DocsLayout>
