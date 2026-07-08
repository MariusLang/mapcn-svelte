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
		"animate-fade-up animate-stagger mt-3 flex flex-wrap items-center gap-3",
		align === "center" ? "justify-center" : "justify-start",
		className
	)}
	style="--stagger: 3"
>
	{@render children?.()}
</div>
