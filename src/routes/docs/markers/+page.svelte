<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import { ComponentPreview } from "$lib/components/docs/preview";
	import MarkersExample from "$lib/components/docs/preview/examples/MarkersExample.svelte";
	import PopupExample from "$lib/components/docs/preview/examples/PopupExample.svelte";
	import { page } from "$app/state";

	const markersSource = $derived(page.data.markersSource);
	const markersHighlighted = $derived(page.data.markersHighlighted);

	const popupSource = $derived(page.data.popupSource);
	const popupHighlighted = $derived(page.data.popupHighlighted);
</script>

<svelte:head>
	<title>Markers - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="Markers"
	description="Add interactive markers to your map with popups and tooltips."
	prev={{ title: "Controls", href: "/docs/controls" }}
	next={{ title: "Popups", href: "/docs/popups" }}
>
	<DocsSection>
		<p>
			Use
			<DocsCode>MapMarker</DocsCode>
			to place markers on the map. Each marker can have custom content, popups that open on click, and
			tooltips that appear on hover.
		</p>
	</DocsSection>

	<DocsSection title="Basic Example">
		<p>Simple markers with tooltips and popups showing location information.</p>
	</DocsSection>

	<ComponentPreview code={markersSource} highlightedCode={markersHighlighted}>
		<MarkersExample />
	</ComponentPreview>

	<DocsSection title="Rich Popups">
		<p>
			Build complex popups with images, ratings, and action buttons using shadcn-svelte components.
		</p>
	</DocsSection>

	<ComponentPreview code={popupSource} highlightedCode={popupHighlighted} class="h-125">
		<PopupExample />
	</ComponentPreview>
</DocsLayout>
