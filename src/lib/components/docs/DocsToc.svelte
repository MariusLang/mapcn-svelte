<script lang="ts">
	import { cn } from "$lib/utils";
	import { useActiveItem, type TocItem } from "$lib/hooks/use-active-item.svelte.js";

	let { items, className }: { items: TocItem[]; className?: string } = $props();

	const { activeId } = useActiveItem(() => items);

	function scrollTo(slug: string, event: MouseEvent) {
		event.preventDefault();
		const element = document.getElementById(slug);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	}
</script>

{#if items?.length}
	<div class={cn("flex flex-col gap-2.5 text-sm", className)}>
		<p class="text-muted-foreground mb-1 text-xs font-medium">On This Page</p>
		{#each items as item}
			<a
				href={`#${item.slug}`}
				onclick={(e) => scrollTo(item.slug, e)}
				class={cn(
					"text-muted-foreground hover:text-foreground text-[0.8rem] no-underline transition-colors",
					item.slug === activeId && "text-foreground"
				)}
			>
				{item.title}
			</a>
		{/each}
	</div>
{/if}
