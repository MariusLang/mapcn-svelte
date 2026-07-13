<script lang="ts">
	import { cn } from "$lib/utils";
	import { getPageHeaderContext } from "./PageHeader.svelte";

	interface Props {
		class?: string;
		children?: import("svelte").Snippet;
	}

	const { class: className, children }: Props = $props();
	const context = getPageHeaderContext();
	const align = $derived(context.align());
	const size = $derived(context.size());
</script>

<p
	class={cn(
		"text-foreground/80 animate-fade-up animate-stagger max-w-2xl leading-relaxed",
		size === "sm" ? "text-muted-foreground text-base sm:text-lg" : "sm:text-lg md:text-xl",
		align === "center" ? "text-center" : "text-left",
		className
	)}
	style="--stagger: 2"
>
	{@render children?.()}
</p>
