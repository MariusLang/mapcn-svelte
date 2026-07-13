<script lang="ts">
	import { highlightCode } from "$lib/highlight";
	import CopyButton from "$lib/components/CopyButton.svelte";
	import CodeSurface from "$lib/components/CodeSurface.svelte";
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

<div class="relative w-full overflow-hidden rounded-lg">
	{#if showCopyButton}
		<div class="absolute top-2 right-2 z-10">
			<CopyButton command={code} />
		</div>
	{/if}

	{#if highlightedCode}
		<CodeSurface class="overflow-auto" html={highlightedCode} />
	{:else}
		<pre class="bg-code overflow-auto p-4 text-sm"><code>{code}</code></pre>
	{/if}
</div>
