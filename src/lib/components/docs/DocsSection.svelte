<script lang="ts">
	const { title, children } = $props<{
		title?: string;
		children?: import("svelte").Snippet;
	}>();
</script>

<section class="space-y-5">
	{#if title}
		<h2 class="text-xl font-semibold tracking-tight">{title}</h2>
	{/if}

	<div class="text-foreground/80 space-y-4 leading-7 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-6">
		{@render children?.()}
	</div>
</section>
