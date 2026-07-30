<script lang="ts">
	import { onMount } from "svelte";
	import { theme } from "$lib/theme";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();
	const Component = $derived(data.component as import("svelte").Component);

	onMount(() => {
		function syncTheme(event: MessageEvent) {
			if (
				event.origin === window.location.origin &&
				event.data?.type === "mapcn:theme" &&
				(event.data.theme === "light" || event.data.theme === "dark")
			) {
				theme.set(event.data.theme);
			}
		}

		window.addEventListener("message", syncTheme);
		return () => window.removeEventListener("message", syncTheme);
	});
</script>

<svelte:head>
	<title>{data.name} - mapcn-svelte</title>
</svelte:head>

<div class="bg-background min-h-screen">
	<Component />
</div>
