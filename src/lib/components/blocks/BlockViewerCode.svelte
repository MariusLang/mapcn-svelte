<script lang="ts">
	import { useCopy } from "$lib/use-copy.svelte";
	import Check from "@lucide/svelte/icons/check";
	import Copy from "@lucide/svelte/icons/copy";
	import * as Sidebar from "$lib/registry/ui/sidebar/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import type { FileTree } from "$lib/blocks.js";
	import TreeNode from "./TreeNode.svelte";
	import { trackEvent } from "$lib/events";
	import CodeSurface from "$lib/components/CodeSurface.svelte";

	export interface HighlightedFile {
		path: string;
		target: string;
		content: string;
		highlightedContent: string;
	}

	interface Props {
		tree: FileTree[];
		highlightedFiles: HighlightedFile[];
	}

	const { tree, highlightedFiles }: Props = $props();

	let activeFile = $derived.by(() => highlightedFiles[0]?.target ?? "");

	const currentFile = $derived(highlightedFiles.find((f) => f.target === activeFile));

	const clipboard = useCopy();

	async function copyCode() {
		const file = currentFile;
		if (!file || !(await clipboard.copy(file.content))) return;
		trackEvent({ name: "copy_block_code", properties: { file: file.target } });
	}
</script>

<div
	class="bg-background ring-foreground/5 flex h-(--block-preview-height) overflow-hidden rounded-lg shadow-xs ring-1"
>
	<!-- File tree sidebar -->
	<div class="w-56 shrink-0">
		<Sidebar.Provider class="flex min-h-full! flex-col border-r">
			<Sidebar.Root collapsible="none" class="bg-card w-full flex-1">
				<Sidebar.GroupLabel class="h-12 rounded-none border-b px-4 pr-2 text-sm">
					Files
				</Sidebar.GroupLabel>
				<Sidebar.Group class="p-0">
					<Sidebar.GroupContent>
						<Sidebar.Menu class="translate-x-0 gap-1.5">
							{#each tree as item, i (i)}
								<TreeNode {item} depth={1} {activeFile} onSelect={(path) => (activeFile = path)} />
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			</Sidebar.Root>
		</Sidebar.Provider>
	</div>

	<!-- Code panel -->
	<div class="flex min-w-0 flex-1 flex-col">
		<div class="bg-muted/40 flex h-12 shrink-0 items-center gap-2 border-b px-4 pr-2 text-sm">
			<span class="text-muted-foreground truncate">{currentFile?.target ?? ""}</span>
			<div class="ml-auto">
				<Button
					variant="ghost"
					size="icon-sm"
					onclick={copyCode}
					aria-label={clipboard.label("Copy code")}
				>
					{#if clipboard.copied}
						<Check class="size-4" />
					{:else}
						<Copy class="size-4" />
					{/if}
				</Button>
			</div>
		</div>
		{#if currentFile}
			{#key currentFile.path}
				<CodeSurface class="flex-1 overflow-y-auto" html={currentFile.highlightedContent} />
			{/key}
		{/if}
	</div>
</div>
