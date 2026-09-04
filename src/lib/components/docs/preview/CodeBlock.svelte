<script lang="ts">
	import { highlightCode } from "$lib/highlight";
	import CopyButton from "$lib/components/CopyButton.svelte";
	import CodeSurface from "$lib/components/CodeSurface.svelte";
	import { cn } from "$lib/utils";
	import { onMount } from "svelte";

	let {
		code,
		language = "svelte",
		filename,
		showCopyButton = true,
		showLineNumbers = true,
	}: {
		code: string;
		language?: string;
		filename?: string;
		showCopyButton?: boolean;
		showLineNumbers?: boolean;
	} = $props();

	let highlightedCode = $state<string>("");

	onMount(async () => {
		highlightedCode = await highlightCode(code, language);
	});
</script>

<div class="relative w-full overflow-hidden rounded-lg">
	{#if filename}
		<div
			class="bg-code border-border/60 flex items-center justify-between gap-3 border-b py-1 pr-1.5 pl-4"
		>
			<span class="text-muted-foreground truncate font-mono text-xs">{filename}</span>
			{#if showCopyButton}
				<CopyButton command={code} />
			{/if}
		</div>
	{:else if showCopyButton}
		<div class="absolute top-2 right-2 z-10">
			<CopyButton command={code} />
		</div>
	{/if}

	{#if highlightedCode}
		<CodeSurface
			class={cn("overflow-auto", !showLineNumbers && "no-line-numbers pl-4")}
			html={highlightedCode}
		/>
	{:else}
		<pre
			class={cn("bg-code overflow-auto p-4 text-sm", !showLineNumbers && "no-line-numbers")}><code
				>{code}</code
			></pre>
	{/if}
</div>
