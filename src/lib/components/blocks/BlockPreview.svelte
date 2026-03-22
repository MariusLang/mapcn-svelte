<script lang="ts">
	import type { Snippet } from "svelte";
	import Check from "@lucide/svelte/icons/check";
	import Code from "@lucide/svelte/icons/code";
	import Eye from "@lucide/svelte/icons/eye";
	import Fullscreen from "@lucide/svelte/icons/fullscreen";
	import Terminal from "@lucide/svelte/icons/terminal";
	import * as Tabs from "$lib/registry/ui/tabs/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import { Separator } from "$lib/registry/ui/separator/index.js";
	import BlockViewerCode, { type HighlightedFile } from "./BlockViewerCode.svelte";
	import type { FileTree, RegistryBlockItem } from "$lib/blocks.js";

	interface Props {
		block: RegistryBlockItem;
		tree: FileTree[];
		highlightedFiles: HighlightedFile[];
		preview: Snippet;
	}

	const { block, tree, highlightedFiles, preview }: Props = $props();

	let copiedType: "cli" | null = $state(null);

	async function copyCli() {
		await navigator.clipboard.writeText(
			`npx shadcn-svelte add https://mapcn-svelte.dev/r/${block.name}.json`
		);
		copiedType = "cli";
		setTimeout(() => (copiedType = null), 2000);
	}
</script>

<div class="space-y-4" style="--block-preview-height: {block.meta?.iframeHeight ?? '930px'}">
	<div>
		<h2 class="text-xl font-semibold tracking-tight">{block.title}</h2>
		{#if block.description}
			<p class="text-muted-foreground mt-1 text-sm">{block.description}</p>
		{/if}
	</div>

	<Tabs.Tabs value="preview" class="w-full">
		<div class="flex items-center justify-between">
			<Tabs.TabsList class="h-8!">
				<Tabs.TabsTrigger value="preview" class="text-xs">
					<Eye class="size-3.5" />
					Preview
				</Tabs.TabsTrigger>
				<Tabs.TabsTrigger value="code" class="text-xs">
					<Code class="size-3.5" />
					Code
				</Tabs.TabsTrigger>
			</Tabs.TabsList>

			<div class="hidden items-center gap-3 md:flex">
				<Button
					variant="outline"
					size="icon-sm"
					href="/view/{block.name}"
					target="_blank"
					aria-label="Open in new tab"
				>
					<Fullscreen />
				</Button>
				<Separator orientation="vertical" class="h-4!" />
				<Button variant="outline" size="sm" onclick={copyCli} aria-label="Copy CLI command">
					{#if copiedType === "cli"}
						<Check />
					{:else}
						<Terminal />
					{/if}
					npx shadcn-svelte add https://mapcn-svelte.dev/r/{block.name}.json
				</Button>
			</div>
		</div>

		<Tabs.TabsContent value="preview" class="mt-2">
			{@render preview()}
		</Tabs.TabsContent>

		<Tabs.TabsContent value="code" class="mt-2">
			<BlockViewerCode {tree} {highlightedFiles} />
		</Tabs.TabsContent>
	</Tabs.Tabs>
</div>
