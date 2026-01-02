<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import { ComponentPreview } from "$lib/components/docs/preview";
	import StandalonePopupExample from "$lib/components/docs/preview/examples/StandalonePopupExample.svelte";
	import { page } from "$app/state";

	const popupSource = $derived(page.data.popupSource);
	const popupHighlighted = $derived(page.data.popupHighlighted);
</script>

<DocsLayout
	title="Standalone Popups"
	description="Display popups anywhere on the map without markers."
	prev={{ title: "Markers", href: "/docs/markers" }}
	next={{ title: "Routes", href: "/docs/routes" }}
>
	<DocsSection>
		<p>
			Use <DocsCode>MapPopup</DocsCode> to display a popup at any location on the map. Unlike
			<DocsCode>MarkerPopup</DocsCode>, standalone popups are not attached to markers and can be
			controlled programmatically.
		</p>
	</DocsSection>

	<ComponentPreview code={popupSource} highlightedCode={popupHighlighted}>
		<StandalonePopupExample />
	</ComponentPreview>
</DocsLayout>
