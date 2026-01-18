<script lang="ts">
	import Copy from "@lucide/svelte/icons/copy";
	import Check from "@lucide/svelte/icons/check";

	const { command }: { command: string } = $props();

	let copied = $state(false);

	const copy = () => {
		navigator.clipboard.writeText(command);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	};
</script>

<button onclick={copy} class="hover:bg-muted rounded p-1.5 transition-colors">
	{#if copied}
		<Check class="size-3.5 text-emerald-500" />
	{:else}
		<Copy class="text-muted-foreground size-3.5" />
	{/if}
</button>
