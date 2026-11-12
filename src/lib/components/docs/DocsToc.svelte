<script lang="ts">
	import { cn } from "$lib/utils";
	import { browser } from "$app/env";
	import { onDestroy } from "svelte";

	interface TocItem {
		title: string;
		slug: string;
	}

	let { items, className }: { items: TocItem[]; className?: string } = $props();

	let activeId = $state<string | null>(null);
	let observer: IntersectionObserver | null = null;

	$effect(() => {
		if (!browser) return;

		const itemIds = items.map((item) => item.slug);
		activeId = itemIds[0] ?? null;

		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeId = entry.target.id;
						break;
					}
				}
			},
			{ rootMargin: "0% 0% -80% 0%" }
		);

		for (const id of itemIds) {
			const element = document.getElementById(id);
			if (element) observer.observe(element);
		}

		return () => observer?.disconnect();
	});

	onDestroy(() => observer?.disconnect());
</script>

{#if items?.length}
	<nav aria-label="On this page" class={cn("flex flex-col gap-0.5", className)}>
		<p class="text-muted-foreground mb-4 text-xs font-medium">On This Page</p>
		<div class="flex flex-col gap-1.5">
			{#each items as item (item.slug)}
				{@const isActive = item.slug === activeId}
				<a
					href={`#${item.slug}`}
					class={cn(
						"py-0.5 text-[0.8rem] no-underline transition-colors",
						isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
					)}
				>
					{item.title}
				</a>
			{/each}
		</div>
	</nav>
{/if}
