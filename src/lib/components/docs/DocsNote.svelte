<script lang="ts">
	const { children } = $props<{
		children?: import("svelte").Snippet;
	}>();
</script>

<div
	class="bg-surface text-foreground/70 [&_strong]:text-foreground rounded-lg px-5 py-4 text-[15px] leading-relaxed [&_strong]:font-medium"
>
	{@render children?.()}
</div>
