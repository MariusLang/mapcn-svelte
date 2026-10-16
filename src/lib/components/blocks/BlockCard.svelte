<script lang="ts">
	import type { RegistryBlockItem } from "$lib/blocks";
	let { block, onopen }: { block: RegistryBlockItem; onopen: (name: string) => void } = $props();
</script>

<a
	id={block.name}
	href={`#${block.name}`}
	onclick={(event) => {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
			return;
		event.preventDefault();
		onopen(block.name);
	}}
	class="bg-muted/50 hover:bg-muted ring-foreground/5 focus-visible:ring-ring/50 dark:bg-muted/30 dark:hover:bg-muted/50 block rounded-2xl p-2 ring-1 transition-[background-color,box-shadow] outline-none focus-visible:ring-[3px]"
>
	<div
		class="bg-background ring-foreground/5 relative aspect-[16/10] overflow-hidden rounded-lg shadow-xs ring-1"
	>
		<img
			src={`/blocks/${block.name}-light.jpg`}
			alt=""
			width="1280"
			height="800"
			loading="lazy"
			class="size-full object-cover dark:hidden"
		/>
		<img
			src={`/blocks/${block.name}-dark.jpg`}
			alt=""
			width="1280"
			height="800"
			loading="lazy"
			class="hidden size-full object-cover dark:block"
		/>
	</div>
	<div class="min-w-0 px-2 pt-3.5 pb-2">
		<h3 class="truncate text-base font-medium">{block.title ?? block.name}</h3>
		{#if block.description}<p class="text-muted-foreground mt-0.5 truncate text-sm">
				{block.description}
			</p>{/if}
	</div>
</a>
