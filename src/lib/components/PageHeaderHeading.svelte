<script lang="ts">
	import { cn } from "$lib/utils";
	import { getPageHeaderContext } from "./PageHeader.svelte";

	interface Props {
		class?: string;
		as?: "h1" | "h2";
		children?: import("svelte").Snippet;
	}

	const { class: className, as = "h1", children }: Props = $props();
	const context = getPageHeaderContext();
	const align = $derived(context.align());
	const size = $derived(context.size());
</script>

{#if as === "h2"}
	<h2
		class={cn(
			"animate-fade-up animate-stagger text-primary max-w-4xl font-bold tracking-tight",
			size === "sm" ? "text-4xl font-semibold md:text-5xl" : "text-4xl sm:text-5xl md:text-6xl",
			align === "center" ? "text-center" : "text-left",
			className
		)}
		style="--stagger: 1"
	>
		{@render children?.()}
	</h2>
{:else}
	<h1
		class={cn(
			"animate-fade-up animate-stagger text-primary max-w-4xl font-bold tracking-tight",
			size === "sm" ? "text-4xl font-semibold md:text-5xl" : "text-4xl sm:text-5xl md:text-6xl",
			align === "center" ? "text-center" : "text-left",
			className
		)}
		style="--stagger: 1"
	>
		{@render children?.()}
	</h1>
{/if}
