<script lang="ts">
	import { cn } from "$lib/utils";

	const { className = "", children } = $props<{
		className?: string;
		children?: import("svelte").Snippet;
	}>();
</script>

<code class={cn("bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm", className)}>
	{@render children?.()}
</code>
