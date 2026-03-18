<script lang="ts">
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();
	const Component = data.component as import("svelte").Component;
</script>

<svelte:head>
	<title>{data.name}</title>
</svelte:head>

<div class="bg-background min-h-screen">
	<Component />
</div>
