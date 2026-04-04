<script lang="ts">
	import { cn } from "$lib/utils";

	const { className = "", children } = $props<{
		className?: string;
		children?: import("svelte").Snippet;
	}>();
</script>

<code class={cn("bg-muted relative rounded-md px-2 py-1 font-mono text-sm", className)}>
	{@render children?.()}
</code>
