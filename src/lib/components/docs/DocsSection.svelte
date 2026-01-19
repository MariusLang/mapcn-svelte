<script lang="ts">
	import { getContext } from "svelte";

	const DOCS_TOC_CONTEXT = "docs-toc";

	interface TocContext {
		registerSection: (item: { title: string; slug: string }) => void;
		unregisterSection: (slug: string) => void;
	}

	const { title, children } = $props<{
		title?: string;
		children?: import("svelte").Snippet;
	}>();

	const slug = $derived(title ? title.toLowerCase().replace(/\s+/g, "-") : undefined);
	let tocContext: TocContext | null = null;

	// Register with TOC context on mount
	$effect.root(() => {
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

		return () => {
			if (tocContext && title && slug) {
				tocContext.unregisterSection(slug);
			}
		};
	});
</script>

<section class="space-y-5">
	{#if title}
		<h2 id={slug} class="scroll-mt-28 text-xl font-semibold tracking-tight">
			{title}
		</h2>
	{/if}

	<div class="text-foreground/80 space-y-4 leading-7 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-6">
		{@render children?.()}
	</div>
</section>
