<script lang="ts">
	const { name }: { name: string } = $props();
</script>

<div
	class="bg-background ring-foreground/5 relative aspect-[16/10] overflow-hidden rounded-lg shadow-xs ring-1"
>
	<img
		src="/blocks/{name}-light.jpg"
		alt=""
		width="1280"
		height="800"
		loading="lazy"
		class="size-full object-cover dark:hidden"
	/>
	<img
		src="/blocks/{name}-dark.jpg"
		alt=""
		width="1280"
		height="800"
		loading="lazy"
		class="hidden size-full object-cover dark:block"
	/>
</div>
