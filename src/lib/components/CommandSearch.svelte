<script lang="ts">
	import { ArrowDown, ArrowUp, CornerDownLeft, SearchIcon } from "@lucide/svelte";
	import * as Command from "$lib/registry/ui/command/index.js";
	import { Kbd } from "$lib/registry/ui/kbd/index.js";
	import { docsNavigation } from "$lib/docs-navigation";
	import Button from "$lib/registry/ui/button/button.svelte";

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
	variant="outline"
	size="sm"
	onclick={() => (open = true)}
	aria-label="Search documentation"
	class="group dark:border-border/50 border-border/70 text-muted-foreground hidden w-[180px] items-center rounded-lg text-sm font-normal md:flex"
>
	<SearchIcon className="size-3.5 shrink-0" />
	<span>Search docs...</span>
	<Kbd class="ml-auto">⌘K</Kbd>
</Button>

<Command.Dialog
	bind:open
	title="Search Documentation"
	description="Search for documentation pages and components"
>
	<Command.Input placeholder="Type to search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		{#each docsNavigation as group}
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
					<CornerDownLeft className="size-3" />
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
