<script lang="ts">
	import ChevronRight from "@lucide/svelte/icons/chevron-right";
	import File from "@lucide/svelte/icons/file";
	import Folder from "@lucide/svelte/icons/folder";
	import * as Collapsible from "$lib/registry/ui/collapsible/index.js";
	import * as Sidebar from "$lib/registry/ui/sidebar/index.js";
	import type { FileTree } from "$lib/blocks.js";
	import TreeNode from "./TreeNode.svelte";

	interface Props {
		item: FileTree;
		depth: number;
		activeFile: string;
		onSelect: (path: string) => void;
	}

	const { item, depth, activeFile, onSelect }: Props = $props();
</script>

{#if !item.children}
	<Sidebar.MenuItem>
		<Sidebar.MenuButton
			isActive={item.path === activeFile}
			onclick={() => item.path && onSelect(item.path)}
			class="hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 rounded-none whitespace-nowrap data-[active=true]:bg-muted-foreground/15"
			style="padding-left: {depth * 1.2}rem"
		>
			<ChevronRight class="invisible" />
			<File class="size-4" />
			{item.name}
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
{:else}
	<Sidebar.MenuItem>
		<Collapsible.Collapsible open class="w-full [&[data-state=open]>button>svg:first-child]:rotate-90">
			<Collapsible.CollapsibleTrigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						class="hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 rounded-none whitespace-nowrap w-full"
						style="padding-left: {depth * 1.0}rem"
					>
						<ChevronRight class="transition-transform" />
						<Folder />
						{item.name}
					</Sidebar.MenuButton>
				{/snippet}
			</Collapsible.CollapsibleTrigger>
			<Collapsible.CollapsibleContent>
				<Sidebar.MenuSub class="m-0 w-full translate-x-0 border-none p-0">
					{#each item.children as child, j (j)}
						<TreeNode item={child} depth={depth + 1} {activeFile} {onSelect} />
					{/each}
				</Sidebar.MenuSub>
			</Collapsible.CollapsibleContent>
		</Collapsible.Collapsible>
	</Sidebar.MenuItem>
{/if}
