<script lang="ts">
	import { cn } from "$lib/utils";

	const { className = "", children } = $props<{
		className?: string;
		children?: import("svelte").Snippet;
	}>();
</script>

<code class={cn("bg-muted relative rounded-md px-1.5 py-0.5 font-mono text-sm", className)}>
	{@render children?.()}
</code>
