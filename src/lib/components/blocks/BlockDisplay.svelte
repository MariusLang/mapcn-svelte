<script lang="ts">
	import BlockPreview from "./BlockPreview.svelte";
	import IframePreview from "./IframePreview.svelte";
	import type { FileTree, RegistryBlockItem } from "$lib/blocks.js";
	import type { HighlightedFile } from "./BlockViewerCode.svelte";

	interface Props {
		block: RegistryBlockItem;
		tree: FileTree[];
		highlightedFiles: HighlightedFile[];
	}

	const { block, tree, highlightedFiles }: Props = $props();
</script>

<BlockPreview {block} {tree} {highlightedFiles}>
	{#snippet preview()}
		<IframePreview src="/view/{block.name}" title={block.title ?? block.name} />
	{/snippet}
</BlockPreview>
