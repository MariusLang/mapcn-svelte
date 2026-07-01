<script lang="ts">
	import Check from "@lucide/svelte/icons/check";
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
	class="border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 h-7 gap-1.5 rounded-full border px-3 text-xs"
>
	{#if copied}
		<Check />
	{/if}
	{copied ? "Copied - paste it into your coding agent" : "Building with an agent? Copy the prompt"}
</Button>
