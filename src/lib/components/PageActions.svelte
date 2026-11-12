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
</script>

<div
	class={cn(
		"mt-3 flex flex-wrap items-center gap-3",
		context.animated() && "animate-fade-up animate-stagger",
		align === "center" ? "justify-center" : "justify-start",
		className
	)}
	style="--stagger: 3"
>
	{@render children?.()}
</div>
