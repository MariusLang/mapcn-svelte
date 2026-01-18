<script lang="ts">
	import { cn } from "$lib/utils";

	interface Props {
		label?: string;
		class?: string;
		delay?: string;
		children?: import("svelte").Snippet;
	}

	const { label, class: className, delay = "delay-500", children }: Props = $props();
</script>

<div
	class={cn(
		"bg-card border-border/50 animate-scale-in relative overflow-hidden rounded-xl border shadow-sm",
		delay,
		className
	)}
>
	{#if label}
		<div
			class="text-muted-foreground bg-background/90 absolute top-2 left-2 z-10 rounded px-2 py-1 text-[10px] tracking-wider uppercase backdrop-blur-sm"
		>
			{label}
		</div>
	{/if}
	{@render children?.()}
</div>
