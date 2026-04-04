<script lang="ts">
	import Copy from "@lucide/svelte/icons/copy";
	import Check from "@lucide/svelte/icons/check";
	import { Button } from "$lib/registry/ui/button/index.js";

	const { command }: { command: string } = $props();

	let copied = $state(false);

	const copy = () => {
		navigator.clipboard.writeText(command);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	};
</script>

<Button variant="ghost" size="icon-sm" onclick={copy}>
	{#if copied}
		<Check class="size-3.5 text-emerald-500" />
	{:else}
		<Copy class="text-muted-foreground size-3.5" />
	{/if}
</Button>
