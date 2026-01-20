<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import DocsNote from "$lib/components/docs/DocsNote.svelte";
	import DocsLink from "$lib/components/docs/DocsLink.svelte";
	import { ComponentPreview } from "$lib/components/docs/preview";
	import MarkersExample from "$lib/components/docs/preview/examples/MarkersExample.svelte";
	import PopupExample from "$lib/components/docs/preview/examples/PopupExample.svelte";
	import DraggableMarkerExample from "$lib/components/docs/preview/examples/DraggableMarkerExample.svelte";
	import { page } from "$app/state";

	const markersSource = $derived(page.data.markersSource);
	const markersHighlighted = $derived(page.data.markersHighlighted);

	const popupSource = $derived(page.data.popupSource);
	const popupHighlighted = $derived(page.data.popupHighlighted);

	const draggableMarkerSource = $derived(page.data.draggableMarkerSource);
	const draggableMarkerHighlighted = $derived(page.data.draggableMarkerHighlighted);
</script>

<svelte:head>
	<title>Markers - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="Markers"
	description="Add interactive markers to your map with popups and tooltips."
	pathname="/docs/markers"
>
	<DocsSection>
		<p>
			Use
			<DocsCode>MapMarker</DocsCode>
			to place markers on the map. Each marker can have custom content, popups that open on click, and
			tooltips that appear on hover.
		</p>
	</DocsSection>

	<DocsNote>
		<strong>Performance tip:</strong>
		<DocsCode>MapMarker</DocsCode> is DOM-based and works best for a few hundred markers. For larger datasets,
		see the
		<DocsLink href="/docs/advanced-usage#example-markers-via-layers">
			GeoJSON layers example
		</DocsLink>
		instead. Rendering many DOM markers can make the browser sluggish.
	</DocsNote>

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

	<DocsSection title="Draggable Marker">
		<p>
			Create draggable markers that users can move around the map. Click the marker to see its
			current coordinates in a popup.
		</p>
	</DocsSection>

	<ComponentPreview code={draggableMarkerSource} highlightedCode={draggableMarkerHighlighted}>
		<DraggableMarkerExample />
	</ComponentPreview>
</DocsLayout>
