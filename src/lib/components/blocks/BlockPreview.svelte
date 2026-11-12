<script lang="ts">
	import { onMount, type Snippet } from "svelte";
	import Check from "@lucide/svelte/icons/check";
	import Maximize from "@lucide/svelte/icons/maximize";
	import Terminal from "@lucide/svelte/icons/terminal";
	import * as Tabs from "$lib/registry/ui/tabs/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import BlockThumbnail from "./BlockThumbnail.svelte";
	import BlockViewerCode, { type HighlightedFile } from "./BlockViewerCode.svelte";
	import type { FileTree, RegistryBlockItem } from "$lib/blocks.js";
	import { trackEvent } from "$lib/events";
	import { useCopy } from "$lib/use-copy.svelte";

	interface Props {
		block: RegistryBlockItem;
		tree: FileTree[];
		highlightedFiles: HighlightedFile[];
		preview: Snippet;
	}

	const { block, tree, highlightedFiles, preview }: Props = $props();
	const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? "https://mapcn-svelte.dev";
	const command = $derived(`npx shadcn-svelte@latest add ${siteUrl}/r/${block.name}.json`);
	const tabTriggerClassName =
		"text-muted-foreground hover:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground dark:data-[state=active]:bg-accent rounded-sm px-3 text-xs data-[state=active]:shadow-none! dark:data-[state=active]:border-transparent";
	const clipboard = useCopy();
	let desktop = $state(false);

	onMount(() => {
		const media = matchMedia("(min-width: 48rem)");
		const update = () => (desktop = media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	});

	async function copyCli() {
		if (await clipboard.copy(command)) {
			trackEvent({ name: "copy_block_cli", properties: { block: block.name } });
		}
	}
</script>

<Tabs.Tabs
	value="preview"
	class="w-full gap-4"
	style="--block-preview-height: {block.meta?.iframeHeight ?? '930px'}"
>
	<div class="flex flex-wrap items-center justify-between gap-3 max-md:hidden">
		<Tabs.TabsList
			class="bg-background dark:border-input dark:bg-input/30 h-8! gap-0.5 rounded-md border p-0.5 shadow-xs"
		>
			<Tabs.TabsTrigger value="preview" class={tabTriggerClassName}>Preview</Tabs.TabsTrigger>
			<Tabs.TabsTrigger value="code" class={tabTriggerClassName}>Code</Tabs.TabsTrigger>
		</Tabs.TabsList>
		<div class="flex min-w-0 items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				onclick={copyCli}
				aria-label={clipboard.label("Copy CLI command")}
				class="min-w-0 font-mono text-xs"
			>
				{#if clipboard.copied}<Check />{:else}<Terminal />{/if}
				<span class="truncate">{command}</span>
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
	<div class="bg-muted/50 ring-foreground/5 dark:bg-muted/30 rounded-2xl p-2 ring-1">
		<div class="md:hidden"><BlockThumbnail name={block.name} /></div>
		{#if desktop}
			<Tabs.TabsContent value="preview" class="data-[state=inactive]:hidden max-md:hidden">
				{@render preview()}
			</Tabs.TabsContent>
			<Tabs.TabsContent value="code" class="max-md:hidden"
				><BlockViewerCode {tree} {highlightedFiles} /></Tabs.TabsContent
			>
		{/if}
	</div>
</Tabs.Tabs>
