<script lang="ts">
	const { children } = $props<{
		children?: import("svelte").Snippet;
	}>();
</script>

<div
	class="bg-muted/40 text-muted-foreground [&>strong]:text-foreground rounded-lg border px-5 pt-4 text-sm
	       leading-relaxed [&>strong]:font-medium"
>
	{@render children?.()}
</div>
