<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { theme } from "$lib/theme";
	import { Button } from "$lib/registry/ui/button/index";
	import { Kbd } from "$lib/registry/ui/kbd/index";
	import * as Tooltip from "$lib/registry/ui/tooltip/index";

	let mounted = $state(false);
	let currentTheme: "light" | "dark";

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

{#if browser}
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				onclick={toggleTheme}
				variant="ghost"
				aria-label="Toggle theme"
				size="icon-sm"
				disabled={!mounted}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-4.5"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
					<path d="M12 3l0 18" />
					<path d="M12 9l4.65 -4.65" />
					<path d="M12 14.3l7.37 -7.37" />
					<path d="M12 19.6l8.85 -8.85" />
				</svg>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content class="flex items-center gap-2 pr-1">
			Toggle Theme <Kbd>T</Kbd>
		</Tooltip.Content>
	</Tooltip.Root>
{/if}
