<script lang="ts">
	import { onMount } from "svelte";
	import { toggleTheme, THEME_HOTKEY } from "$lib/theme";
	import { Button } from "$lib/registry/ui/button/index";
	import Moon from "@lucide/svelte/icons/moon";
	import Sun from "@lucide/svelte/icons/sun";

	onMount(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	});

	function handleKeyDown(e: KeyboardEvent) {
		if (e.defaultPrevented || e.repeat) return;
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		if (e.key.toLowerCase() !== THEME_HOTKEY) return;

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

<Button
	onclick={toggleTheme}
	variant="ghost"
	aria-label="Toggle theme"
	aria-keyshortcuts={THEME_HOTKEY.toUpperCase()}
	size="icon-sm"
	class="text-muted-foreground hover:text-foreground"
>
	<Moon class="hidden dark:block" />
	<Sun class="block dark:hidden" />
</Button>
