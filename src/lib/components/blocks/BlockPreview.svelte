<script lang="ts">
	import type { Snippet } from "svelte";
	import Check from "@lucide/svelte/icons/check";
	import Maximize from "@lucide/svelte/icons/maximize";
	import Terminal from "@lucide/svelte/icons/terminal";
	import * as Tabs from "$lib/registry/ui/tabs/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import { Separator } from "$lib/registry/ui/separator/index.js";
	import BlockViewerCode, { type HighlightedFile } from "./BlockViewerCode.svelte";
	import type { FileTree, RegistryBlockItem } from "$lib/blocks.js";
	import { trackEvent } from "$lib/events";

	interface Props {
		block: RegistryBlockItem;
		tree: FileTree[];
		highlightedFiles: HighlightedFile[];
		preview: Snippet;
	}

	const { block, tree, highlightedFiles, preview }: Props = $props();

	const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? "https://mapcn-svelte.dev";

	const tabTriggerClassName =
		"text-muted-foreground hover:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground dark:data-[state=active]:bg-accent rounded-sm px-3 text-xs data-[state=active]:shadow-none! dark:data-[state=active]:border-transparent";
	let activeTab = $state("preview");
	let copiedType: "cli" | null = $state(null);

	async function copyCli() {
		await navigator.clipboard.writeText(`npx shadcn-svelte add ${siteUrl}/r/${block.name}.json`);
		copiedType = "cli";
		setTimeout(() => (copiedType = null), 2000);
		trackEvent({ name: "copy_block_cli", properties: { block: block.name } });
	}
</script>

<div
	id={block.name}
	class="scroll-mt-24"
	style="--block-preview-height: {block.meta?.iframeHeight ?? '930px'}"
>
	<Tabs.Tabs bind:value={activeTab} class="w-full gap-4">
		<div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between xl:gap-6">
			<div class="min-w-0">
				<h3 class="text-lg font-semibold tracking-tight">{block.title}</h3>
				{#if block.description}<p class="text-muted-foreground mt-0.5 text-sm">
						{block.description}
					</p>{/if}
			</div>
			<div class="flex shrink-0 items-center gap-3">
				<Tabs.TabsList
					class="bg-background dark:border-input dark:bg-input/30 h-8! gap-0.5 rounded-md border p-0.5 shadow-xs"
				>
					<Tabs.TabsTrigger value="preview" class={tabTriggerClassName}>Preview</Tabs.TabsTrigger>
					<Tabs.TabsTrigger value="code" class={tabTriggerClassName}>Code</Tabs.TabsTrigger>
				</Tabs.TabsList>
				<div class="hidden items-center gap-2 md:flex">
					<Separator orientation="vertical" class="mr-1 h-5!" />
					<Button
						variant="outline"
						size="sm"
						onclick={copyCli}
						aria-label="Copy CLI command"
						class="font-mono text-xs"
					>
						{#if copiedType === "cli"}<Check />{:else}<Terminal />{/if}
						npx shadcn-svelte add {siteUrl}/r/{block.name}.json
					</Button>
					<Button
						variant="outline"
						size="icon-sm"
						href="/view/{block.name}"
						target="_blank"
						aria-label="Open in new tab"><Maximize /></Button
					>
				</div>
			</div>
		</div>
		<Tabs.TabsContent value="preview" hidden={activeTab !== "preview"}>
			{@render preview()}
		</Tabs.TabsContent>
		<Tabs.TabsContent value="code"><BlockViewerCode {tree} {highlightedFiles} /></Tabs.TabsContent>
	</Tabs.Tabs>
</div>
