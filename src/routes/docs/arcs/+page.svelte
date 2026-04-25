<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import { ComponentPreview } from "$lib/components/docs/preview";
	import ArcExample from "$lib/components/docs/preview/examples/ArcExample.svelte";
	import InteractiveArcExample from "$lib/components/docs/preview/examples/InteractiveArcExample.svelte";
	import { page } from "$app/state";

	const arcSource = $derived(page.data.arcSource);
	const arcHighlighted = $derived(page.data.arcHighlighted);
	const interactiveArcSource = $derived(page.data.interactiveArcSource);
	const interactiveArcHighlighted = $derived(page.data.interactiveArcHighlighted);
</script>

<svelte:head>
	<title>Arcs - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="Arcs"
	description="Draw curved connections between two coordinates with hover and click support."
	pathname="/docs/arcs"
>
	<DocsSection>
		<p>
			Use <DocsCode>MapArc</DocsCode> to draw curved lines between coordinate pairs. Arcs are great
			for showing flight paths, shipping lanes, or any origin–destination connection where a straight
			line would feel flat.
		</p>
	</DocsSection>

	<DocsSection title="Basic Arc">
		<p>
			Pass an array of arcs to the <DocsCode>data</DocsCode> prop. Each arc needs a unique
			<DocsCode>id</DocsCode> and <DocsCode>from</DocsCode> / <DocsCode>to</DocsCode> coordinates as
			<DocsCode>[longitude, latitude]</DocsCode> tuples.
		</p>
		<ComponentPreview code={arcSource} highlightedCode={arcHighlighted}>
			<ArcExample />
		</ComponentPreview>
	</DocsSection>

	<DocsSection title="Interactive Arcs">
		<p>
			Combine <DocsCode>hoverPaint</DocsCode> with <DocsCode>onhover</DocsCode> to highlight an arc
			and surface details in a <DocsCode>MapPopup</DocsCode>. Use a
			<DocsCode>match</DocsCode> expression on <DocsCode>line-color</DocsCode> to style arcs by category.
			Here, air and sea lanes are styled differently.
		</p>
		<ComponentPreview code={interactiveArcSource} highlightedCode={interactiveArcHighlighted}>
			<InteractiveArcExample />
		</ComponentPreview>
	</DocsSection>
</DocsLayout>
