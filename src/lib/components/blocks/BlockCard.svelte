<script lang="ts">
	import BlockThumbnail from "./BlockThumbnail.svelte";
	import type { RegistryBlockItem } from "$lib/blocks";
	let { block }: { block: RegistryBlockItem } = $props();
</script>

<a
	id={block.name}
	href={`/blocks/${block.name}`}
	class="bg-muted/50 hover:bg-muted ring-foreground/5 focus-visible:ring-ring/50 dark:bg-muted/30 dark:hover:bg-muted/50 block rounded-2xl p-2 ring-1 transition-[background-color,box-shadow] outline-none focus-visible:ring-[3px]"
>
	<BlockThumbnail name={block.name} />
	<div class="min-w-0 px-2 pt-3.5 pb-2">
		<h3 class="truncate text-base font-medium">{block.title ?? block.name}</h3>
		{#if block.description}<p class="text-muted-foreground mt-0.5 truncate text-sm">
				{block.description}
			</p>{/if}
	</div>
</a>
