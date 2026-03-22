<script lang="ts">
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();
	const Component = $derived(data.component as import("svelte").Component);
</script>

<svelte:head>
	<title>{data.name} - mapcn-svelte</title>
</svelte:head>

<div class="bg-background min-h-screen">
	<Component />
</div>
