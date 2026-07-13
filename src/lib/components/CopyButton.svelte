<script lang="ts">
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

	let copied = $state(false);

	const copy = () => {
		navigator.clipboard.writeText(command);
		copied = true;
		setTimeout(() => (copied = false), 2000);
		onCopy?.();
	};
</script>

<Button
	variant="ghost"
	size="icon-sm"
	onclick={copy}
	aria-label={copied ? "Copied" : "Copy code"}
	class={cn("text-muted-foreground bg-code", className)}
>
	{#if copied}
		<Check class="size-3.5" />
	{:else}
		<Copy class="size-3.5" />
	{/if}
</Button>
