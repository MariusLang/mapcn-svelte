<script lang="ts">
	import { useCopy } from "$lib/use-copy.svelte";
	import Check from "@lucide/svelte/icons/check";
	import Copy from "@lucide/svelte/icons/copy";
	import { Button } from "$lib/registry/ui/button/index";
	import { mapInstallAgentPrompt } from "$lib/llm-prompts";
	import { trackEvent } from "$lib/events";

	const clipboard = useCopy(2500);

	async function copyPrompt() {
		if (await clipboard.copy(mapInstallAgentPrompt)) trackEvent({ name: "copy_agent_prompt" });
	}
</script>

<Button
	type="button"
	onclick={copyPrompt}
	aria-live="polite"
	variant="outline"
	size="sm"
	class="text-muted-foreground hover:text-foreground h-7 shrink-0 bg-transparent px-2.5! text-[13px] font-normal shadow-none dark:bg-transparent"
>
	{#if clipboard.copied}
		<Check />
	{:else}
		<Copy />
	{/if}
	{clipboard.label("Copy agent prompt")}
</Button>
