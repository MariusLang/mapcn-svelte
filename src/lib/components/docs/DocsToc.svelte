<script lang="ts">
	import { cn } from "$lib/utils";
	import { useActiveItem, type TocItem } from "$lib/hooks/use-active-item.svelte.js";

	let { items, className }: { items: TocItem[]; className?: string } = $props();

	const activeItemTracker = useActiveItem(() => items);

	function scrollTo(slug: string, event: MouseEvent) {
		event.preventDefault();
		const element = document.getElementById(slug);
		if (element) {
			const header = document.querySelector("header");
			const headerOffset = header ? header.offsetHeight + 20 : 100;
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	}
</script>

{#if items?.length > 1}
	<div class={cn("flex flex-col gap-2.5 text-sm", className)}>
		<p class="text-muted-foreground mb-1 text-xs font-medium">On This Page</p>
		{#each items as item}
			<a
				href={`#${item.slug}`}
				onclick={(e) => scrollTo(item.slug, e)}
				class={cn(
					"text-muted-foreground hover:text-foreground text-[0.8rem] no-underline transition-colors",
					item.slug === activeItemTracker.activeId && "text-foreground"
				)}
			>
				{item.title}
			</a>
		{/each}
	</div>
{/if}
