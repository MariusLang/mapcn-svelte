<script lang="ts">
	import { cn } from "$lib/utils";

	interface Props {
		class?: string;
		stagger?: number;
		children?: import("svelte").Snippet;
	}

	const { class: className, stagger = 5, children }: Props = $props();
</script>

<div
	class={cn(
		"bg-card border-border/50 animate-scale-in animate-stagger relative overflow-hidden rounded-xl border shadow-sm",
		className
	)}
	style="--stagger: {stagger}"
>
	{@render children?.()}
</div>
