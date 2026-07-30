<script lang="ts">
	import { onMount } from "svelte";
	import { theme } from "$lib/theme";
	import { Button } from "$lib/registry/ui/button/index";
	import { Skeleton } from "$lib/registry/ui/skeleton";
	import Moon from "@lucide/svelte/icons/moon";
	import Sun from "@lucide/svelte/icons/sun";

	let mounted = $state(false);
	let currentTheme = $state<"light" | "dark">("light");

	const unsubscribe = theme.subscribe((t) => {
		currentTheme = t;
	});

	onMount(() => {
		mounted = true;
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			unsubscribe();
			window.removeEventListener("keydown", handleKeyDown);
		};
	});

	function toggleTheme() {
		theme.set(currentTheme === "dark" ? "light" : "dark");
	}
	function handleKeyDown(e: KeyboardEvent) {
		if (e.defaultPrevented || e.repeat) return;
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		if (e.key.toLowerCase() !== "t") return;

		if (
			(e.target instanceof HTMLElement && e.target.isContentEditable) ||
			e.target instanceof HTMLInputElement ||
			e.target instanceof HTMLTextAreaElement ||
			e.target instanceof HTMLSelectElement
		) {
			return;
		}

		toggleTheme();
	}
</script>

{#if !mounted}
	<Skeleton class="size-8" />
{:else}
	<Button onclick={toggleTheme} variant="ghost" aria-label="Toggle theme" size="icon-sm">
		{#if currentTheme === "dark"}
			<Moon />
		{:else}
			<Sun />
		{/if}
		<span class="sr-only">Toggle theme</span>
	</Button>
{/if}
