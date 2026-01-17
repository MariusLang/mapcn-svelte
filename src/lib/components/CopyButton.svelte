<script lang="ts">
	import { Button } from "$lib/registry/ui/button/index";
	import { Copy, Check } from "@lucide/svelte";

	const { command }: { command: string } = $props();

	let copied = $state(false);

	const copy = () => {
		navigator.clipboard.writeText(command);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	};
</script>

<Button onclick={copy} class="hover:bg-muted rounded p-1.5 transition-colors">
	{#if copied}
		<Check class="size-3.5 text-emerald-500" />
	{:else}
		<Copy class="text-muted-foreground size-3.5" />
	{/if}
</Button>
