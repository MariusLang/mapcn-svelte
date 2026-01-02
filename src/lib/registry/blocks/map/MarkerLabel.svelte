<script lang="ts">
	import { cn } from "$lib/utils.js";

	interface Props {
		children?: import("svelte").Snippet;
		class?: string;
		position?: "top" | "bottom";
	}

	let { children, class: className, position = "top" }: Props = $props();

	const positionClasses = {
		top: "bottom-full mb-1",
		bottom: "top-full mt-1",
	};
</script>

<div
	class={cn(
		"absolute left-1/2 -translate-x-1/2 whitespace-nowrap",
		"text-foreground text-[10px] font-medium",
		positionClasses[position],
		className
	)}
>
	{@render children?.()}
</div>
