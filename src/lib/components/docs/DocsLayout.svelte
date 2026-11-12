<script lang="ts">
	import { setContext } from "svelte";
	import DocsToc from "./DocsToc.svelte";
	import { findNeighbors } from "$lib/docs-navigation";
	import Button from "$lib/registry/ui/button/button.svelte";
	import ChevronLeft from "@lucide/svelte/icons/chevron-left";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";

	interface NavLink {
		title: string;
		href: string;
	}

	interface TocItem {
		title: string;
		slug: string;
	}

	const DOCS_TOC_CONTEXT = "docs-toc";

	const { title, description, pathname, prev, next, toc, action, children } = $props<{
		title: string;
		description: string;
		pathname?: string;
		prev?: NavLink;
		next?: NavLink;
		toc?: TocItem[];
		action?: import("svelte").Snippet;
		children?: import("svelte").Snippet;
	}>();

	const neighbors = $derived.by(() => {
		if (pathname && (!prev || !next)) {
			const result = findNeighbors(pathname);
			return {
				previous: prev ?? result.previous,
				next: next ?? result.next,
			};
		}
		return { previous: prev, next };
	});

	let registeredToc = $state<TocItem[]>([]);
	let sectionRegistry: Record<string, TocItem> = {};

	function registerSection(item: TocItem) {
		if (sectionRegistry[item.slug]) return;
		sectionRegistry[item.slug] = item;
		registeredToc = Object.values(sectionRegistry);
	}

	function unregisterSection(slug: string) {
		if (!sectionRegistry[slug]) return;
		delete sectionRegistry[slug];
		registeredToc = Object.values(sectionRegistry);
	}

	setContext(DOCS_TOC_CONTEXT, {
		registerSection,
		unregisterSection,
	});
</script>

<div class="flex min-w-0 flex-1">
	<div class="mx-auto flex max-w-[50rem] min-w-0 flex-1 flex-col pt-10 pb-20 lg:px-12 lg:pt-12">
		<div class="space-y-2">
			<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-3">
				<h1 class="text-foreground text-3xl font-semibold tracking-tight">{title}</h1>
				{@render action?.()}
			</div>
			<p class="text-muted-foreground leading-relaxed">{description}</p>
		</div>

		<div class="mt-12 mb-12 space-y-14 [&>*:has(+[data-slot=docs-note])]:mb-6">
			{@render children?.()}
		</div>

		{#if neighbors.previous || neighbors.next}
			<div class="mt-auto flex items-center justify-between gap-4">
				{#if neighbors.previous}
					<Button
						variant="ghost"
						size="sm"
						class="-ml-3 h-auto py-2"
						href={neighbors.previous.href}
					>
						<ChevronLeft />
						{neighbors.previous.title}
					</Button>
				{:else}
					<div></div>
				{/if}

				{#if neighbors.next}
					<Button variant="ghost" size="sm" class="-mr-3 h-auto py-2" href={neighbors.next.href}>
						{neighbors.next.title}
						<ChevronRight />
					</Button>
				{/if}
			</div>
		{/if}
	</div>

	<aside class="hidden w-42 shrink-0 xl:block">
		<div
			class="sticky top-14 -mx-3 max-h-[calc(100svh-3.5rem)] [scrollbar-gutter:stable] overflow-y-auto px-3 pt-12 pb-10"
		>
			<DocsToc items={toc ?? registeredToc} />
		</div>
	</aside>
</div>
