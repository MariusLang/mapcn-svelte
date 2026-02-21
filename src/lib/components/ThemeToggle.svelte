<script lang="ts">
	import { onMount } from "svelte";
	import { theme } from "$lib/theme";
	import { Button } from "$lib/registry/ui/button/index";
	import { Kbd } from "$lib/registry/ui/kbd/index";
	import { Skeleton } from "$lib/registry/ui/skeleton";
	import * as Tooltip from "$lib/registry/ui/tooltip/index";
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
		// toggle theme on d/D
		if ((e.key === "t" || e.key === "T") && !e.metaKey && !e.ctrlKey) {
			if (
				(e.target instanceof HTMLElement && e.target.isContentEditable) ||
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement ||
				e.target instanceof HTMLSelectElement
			) {
				return;
			}

			e.preventDefault();
			toggleTheme();
		}
	}
</script>

{#if !mounted}
	<Skeleton class="size-8" />
{:else}
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button onclick={toggleTheme} variant="ghost" aria-label="Toggle theme" size="icon-sm">
				{#if currentTheme === "dark"}
					<Moon />
				{:else}
					<Sun />
				{/if}
				<span class="sr-only">Toggle theme</span>
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content class="flex items-center gap-2 pr-1">
			Toggle Theme <Kbd>T</Kbd>
		</Tooltip.Content>
	</Tooltip.Root>
{/if}
