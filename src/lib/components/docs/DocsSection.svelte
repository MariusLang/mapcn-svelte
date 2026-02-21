<script lang="ts">
	import { getContext, onMount, onDestroy } from "svelte";

	const DOCS_TOC_CONTEXT = "docs-toc";

	interface TocContext {
		registerSection: (item: { title: string; slug: string }) => void;
		unregisterSection: (slug: string) => void;
	}

	const { title, children } = $props<{
		title?: string;
		children?: import("svelte").Snippet;
	}>();

	const slug = $derived(
		title
			? title
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/(^-|-$)/g, "")
			: undefined
	);
	let tocContext: TocContext | null = null;

	// Register with TOC context on mount
	onMount(() => {
		if (title && slug) {
			try {
				tocContext = getContext<TocContext>(DOCS_TOC_CONTEXT);
				if (tocContext) {
					tocContext.registerSection({ title, slug });
				}
			} catch {
				// Not in a DocsLayout context
			}
		}
	});

	onDestroy(() => {
		if (tocContext && title && slug) {
			tocContext.unregisterSection(slug);
		}
	});
</script>

<section class="space-y-5">
	{#if title}
		<h2 id={slug} class="scroll-mt-28 text-xl font-semibold tracking-tight">
			{title}
		</h2>
	{/if}

	<div
		class="text-foreground/80 [&_strong]:text-foreground [&_em]:text-muted-foreground space-y-4 text-base leading-7 [&_li]:leading-7 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_p]:leading-7 [&_strong]:font-medium [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
	>
		{@render children?.()}
	</div>
</section>
