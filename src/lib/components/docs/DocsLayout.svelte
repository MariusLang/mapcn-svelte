<script lang="ts">
	import { setContext } from "svelte";
	import DocsHeader from "./DocsHeader.svelte";
	import DocsToc from "./DocsToc.svelte";
	import { findNeighbors } from "$lib/docs-navigation";

	interface NavLink {
		title: string;
		href: string;
	}

	interface TocItem {
		title: string;
		slug: string;
	}

	const DOCS_TOC_CONTEXT = "docs-toc";

	const { title, description, pathname, prev, next, toc, children } = $props<{
		title: string;
		description: string;
		pathname?: string;
		prev?: NavLink;
		next?: NavLink;
		toc?: TocItem[];
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

	function registerSection(item: TocItem) {
		registeredToc = [...registeredToc, item];
	}

	function unregisterSection(slug: string) {
		registeredToc = registeredToc.filter((item) => item.slug !== slug);
	}

	setContext(DOCS_TOC_CONTEXT, {
		registerSection,
		unregisterSection,
	});
</script>

<div>
	<DocsHeader {title} {description} />

	<div
		class="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_200px] lg:grid-cols-[minmax(0,1fr)_250px]"
	>
		<div class="mt-10 space-y-10">
			{@render children?.()}
		</div>

		<aside class="hidden w-44 shrink-0 xl:block">
			<nav class="sticky top-28">
				<DocsToc items={toc ?? registeredToc} />
			</nav>
		</aside>
	</div>

	{#if neighbors.previous || neighbors.next}
		<div class="mb-14 flex items-center justify-between gap-4 pt-8">
			{#if neighbors.previous}
				<a href={neighbors.previous.href} class="group flex flex-col items-start gap-1.5">
					<span class="text-muted-foreground text-xs">Previous</span>
					<span class="text-sm font-medium underline-offset-4 group-hover:underline">
						{neighbors.previous.title}
					</span>
				</a>
			{:else}
				<div></div>
			{/if}

			{#if neighbors.next}
				<a href={neighbors.next.href} class="group flex flex-col items-end gap-1.5">
					<span class="text-muted-foreground text-xs">Next</span>
					<span class="text-sm font-medium underline-offset-4 group-hover:underline">
						{neighbors.next.title}
					</span>
				</a>
			{/if}
		</div>
	{/if}
</div>
