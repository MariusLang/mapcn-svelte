<script lang="ts">
	import { cn } from "$lib/utils";
	import { browser } from "$app/environment";
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

	onDestroy(() => observer?.disconnect());
</script>

{#if items?.length}
	<div class={cn("flex flex-col gap-1", className)}>
		<p class="text-foreground mb-2 text-xs font-medium">On This Page</p>
		<div class="relative">
			<div class="bg-border absolute top-1 bottom-1 left-0 w-px"></div>
			<div class="flex flex-col gap-1">
				{#each items as item}
					{@const isActive = item.slug === activeId}
					<a
						href={`#${item.slug}`}
						onclick={(e) => scrollTo(item.slug, e)}
						class={cn(
							"relative py-1 pl-3 text-[13px] no-underline transition-colors",
							isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
						)}
					>
						{#if isActive}
							<div class="bg-foreground absolute top-1 bottom-1 left-0 w-px rounded-full"></div>
						{/if}
						{item.title}
					</a>
				{/each}
			</div>
		</div>
	</div>
{/if}
