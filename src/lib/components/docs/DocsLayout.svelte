<script lang="ts">
	import DocsHeader from "./DocsHeader.svelte";
	import { findNeighbors } from "$lib/docs-navigation";

	interface NavLink {
		title: string;
		href: string;
	}

	const { title, description, pathname, prev, next, children } = $props<{
		title: string;
		description: string;
		pathname?: string;
		prev?: NavLink;
		next?: NavLink;
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
</script>

<div>
	<DocsHeader {title} {description} />

	<div class="mt-10 space-y-10">
		{@render children?.()}
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
