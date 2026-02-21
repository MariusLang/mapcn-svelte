<script lang="ts">
	import { highlightCode } from "$lib/highlight";
	import CopyButton from "$lib/components/CopyButton.svelte";
	import { onMount } from "svelte";

	let {
		code,
		language = "svelte",
		showCopyButton = true,
	}: {
		code: string;
		language?: string;
		showCopyButton?: boolean;
	} = $props();

	let highlightedCode = $state<string>("");

	onMount(async () => {
		highlightedCode = await highlightCode(code, language);
	});
</script>

<div class="w-full overflow-hidden rounded-lg border">
	{#if showCopyButton}
		<div class="bg-muted/30 flex h-10 items-center justify-end border-b px-2">
			<CopyButton command={code} />
		</div>
	{/if}

	<div
		class="bg-muted/20 overflow-auto p-4 text-sm [&_code]:bg-transparent! [&_pre]:bg-transparent!"
	>
		{#if highlightedCode}
			{@html highlightedCode}
		{:else}
			<pre><code>{code}</code></pre>
		{/if}
	</div>
</div>
