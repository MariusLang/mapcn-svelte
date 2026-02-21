<script lang="ts">
	const { children } = $props<{
		children?: import("svelte").Snippet;
	}>();
</script>

<div
	class="bg-muted/30 text-foreground/70 [&_strong]:text-foreground rounded-lg border px-5 py-4 text-[14px] leading-relaxed [&_strong]:font-medium"
>
	{@render children?.()}
</div>
