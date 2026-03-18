<script lang="ts">
	import Check from "@lucide/svelte/icons/check";
	import Copy from "@lucide/svelte/icons/copy";
	import * as Sidebar from "$lib/registry/ui/sidebar/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import type { FileTree } from "$lib/blocks.js";
	import TreeNode from "./TreeNode.svelte";

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

	let copied = $state(false);

	async function copyCode() {
		if (!currentFile) return;
		await navigator.clipboard.writeText(currentFile.content);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="flex h-(--block-preview-height) overflow-hidden rounded-xl border">
	<!-- File tree sidebar -->
	<div class="w-56 shrink-0">
		<Sidebar.Provider class="flex min-h-full! flex-col border-r">
			<Sidebar.Root collapsible="none" class="bg-card w-full flex-1">
				<Sidebar.GroupLabel class="h-12 rounded-none border-b px-4 text-sm">
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
		<div class="flex h-12 shrink-0 items-center gap-2 border-b px-4 text-sm">
			<span class="text-muted-foreground truncate">{currentFile?.target ?? ""}</span>
			<div class="ml-auto">
				<Button variant="ghost" size="icon" class="size-7" onclick={copyCode}>
					{#if copied}
						<Check class="size-4" />
					{:else}
						<Copy class="size-4" />
					{/if}
				</Button>
			</div>
		</div>
		{#if currentFile}
			{#key currentFile.path}
				<div
					class="flex-1 overflow-y-auto p-4 text-sm [&_code]:bg-transparent! [&_pre]:bg-transparent!"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html currentFile.highlightedContent}
				</div>
			{/key}
		{/if}
	</div>
</div>
