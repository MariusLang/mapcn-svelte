<script lang="ts">
	import { useCopy } from "$lib/use-copy.svelte";
	import Copy from "@lucide/svelte/icons/copy";
	import Check from "@lucide/svelte/icons/check";
	import { Button } from "$lib/registry/ui/button/index.js";
	import { cn } from "$lib/utils";

	const {
		command,
		class: className,
		onCopy,
	}: {
		command: string;
		class?: string;
		onCopy?: () => void;
	} = $props();

	const clipboard = useCopy();

	async function copy() {
		if (await clipboard.copy(command)) onCopy?.();
	}
</script>

<Button
	variant="ghost"
	size="icon-sm"
	onclick={copy}
	aria-label={clipboard.label("Copy code")}
	class={cn("text-muted-foreground bg-code", className)}
>
	{#if clipboard.copied}
		<Check class="size-3.5" />
	{:else}
		<Copy class="size-3.5" />
	{/if}
</Button>
