<script lang="ts">
	import Check from "@lucide/svelte/icons/check";
	import Copy from "@lucide/svelte/icons/copy";
	import { Button } from "$lib/registry/ui/button/index";
	import { mapInstallAgentPrompt } from "$lib/llm-prompts";
	import { trackEvent } from "$lib/events";

	let copied = $state(false);

	async function copyPrompt() {
		try {
			await navigator.clipboard.writeText(mapInstallAgentPrompt);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2500);
			trackEvent({ name: "copy_agent_prompt" });
		} catch (error) {
			console.error("Failed to copy prompt:", error);
		}
	}
</script>

<Button
	type="button"
	onclick={copyPrompt}
	aria-live="polite"
	variant="ghost"
	class="text-muted-foreground hover:text-foreground border-border/50 h-7 border px-2.5 text-xs"
>
	{#if copied}
		<Check />
	{:else}
		<Copy />
	{/if}
	{copied ? "Copied — paste in your agent" : "Copy prompt for agents"}
</Button>
