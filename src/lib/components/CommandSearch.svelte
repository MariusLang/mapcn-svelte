<script lang="ts">
	import { ArrowDown, ArrowUp, CornerDownLeft, FileText, SearchIcon } from "@lucide/svelte";
	import * as Command from "$lib/registry/ui/command/index.js";
	import { Kbd } from "$lib/registry/ui/kbd/index.js";
	import { siteNavigation } from "$lib/docs-navigation";
	import Button from "$lib/registry/ui/button/button.svelte";
	import { cn } from "$lib/utils";

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();

	let open = $state(false);

	function handleKeyDown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === "k") {
			e.preventDefault();
			open = !open;
		}
	}

	function closeDialog() {
		open = false;
	}

	// Set up keyboard event listener with cleanup
	$effect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	});
</script>

<Button
	variant="ghost"
	size="sm"
	onclick={() => (open = true)}
	aria-label="Jump to pages, components, and docs"
	class={cn(
		"bg-muted dark:bg-muted/50 text-muted-foreground hover:bg-muted/60 dark:hover:bg-muted/60 hover:text-foreground mr-2.5 hidden w-48 md:flex",
		className
	)}
>
	<SearchIcon class="size-3.5" />
	<span>Search...</span>
	<Kbd class="ml-auto bg-transparent">⌘K</Kbd>
</Button>

<Command.Dialog bind:open title="Search..." description="Jump to pages, components, and docs">
	<Command.Input placeholder="Search..." class="h-10 border-none text-sm" />
	<Command.List>
		<Command.Empty class="text-muted-foreground py-8 text-sm">
			<div class="flex flex-col items-center gap-1.5">
				<FileText class="size-5 opacity-40" />
				<span>No results found</span>
			</div>
		</Command.Empty>
		{#each siteNavigation as group}
			<Command.Group heading={group.title}>
				{#each group.items as item}
					<Command.LinkItem href={item.href} value={item.title} onclick={closeDialog}>
						<item.icon />
						<span>{item.title}</span>
					</Command.LinkItem>
				{/each}
			</Command.Group>
		{/each}
	</Command.List>
	<div class="text-muted-foreground/80 flex items-center justify-between border-t p-3 text-xs">
		<div class="flex items-center gap-2.5">
			<span class="flex items-center gap-1.5">
				<Kbd>
					<ArrowUp class="size-3" />
				</Kbd>
				<Kbd>
					<ArrowDown class="size-3" />
				</Kbd>
				<span>navigate</span>
			</span>
			<span class="flex items-center gap-1.5">
				<Kbd>
					<CornerDownLeft class="size-3" />
				</Kbd>
				<span>select</span>
			</span>
		</div>
		<span class="flex items-baseline gap-1.5">
			<Kbd>esc</Kbd>
			<span>close</span>
		</span>
	</div>
</Command.Dialog>
