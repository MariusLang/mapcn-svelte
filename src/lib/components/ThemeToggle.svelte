<script lang="ts">
	import { onMount } from "svelte";
	import { theme } from "$lib/theme";
	import ThemeIcon from "$lib/components/ThemeIcon.svelte";
	import { Button } from "$lib/registry/ui/button/index";

	let mounted = false;
	let currentTheme: "light" | "dark";

	const unsubscribe = theme.subscribe((t) => {
		currentTheme = t;
	});

	onMount(() => {
		mounted = true;
		return unsubscribe;
	});

	function toggleTheme() {
		theme.set(currentTheme === "dark" ? "light" : "dark");
	}
</script>

{#if !mounted}
	<div class="size-4"></div>
{:else}
	<Button onclick={toggleTheme} variant="ghost" size="icon-sm" aria-label="Toggle theme">
		<ThemeIcon className="size-4" />
	</Button>
{/if}
