<script lang="ts">
	import {
		ArrowDown,
		ArrowUp,
		CornerDownLeft,
		FileText,
		SearchIcon,
		Sun,
		Moon,
		Check,
		Terminal,
		Bot,
	} from "@lucide/svelte";
	import * as Command from "$lib/registry/ui/command/index.js";
	import { Kbd } from "$lib/registry/ui/kbd/index.js";
	import { onDestroy } from "svelte";
	import { theme, toggleTheme, THEME_HOTKEY } from "$lib/theme";
	import { mapInstallCommand, mapInstallAgentPrompt } from "$lib/llm-prompts";
	import { trackEvent, type Event } from "$lib/events";
	import GitHubIcon from "./GitHubIcon.svelte";
	import { siteNavigation, githubRepoUrl } from "$lib/docs-navigation";
	import Button from "$lib/registry/ui/button/button.svelte";
	import { cn } from "$lib/utils";

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();

	let open = $state(false);
	let copyStatus = $state<{ id: "install" | "prompt"; ok: boolean } | null>(null);
	let closeTimer: ReturnType<typeof setTimeout> | undefined;
	function handleOpenChange() {
		clearTimeout(closeTimer);
		copyStatus = null;
	}
	onDestroy(() => clearTimeout(closeTimer));
	function runAction(action: () => void) {
		closeDialog();
		action();
	}
	async function copy(id: "install" | "prompt", text: string, event: Event["name"]) {
		clearTimeout(closeTimer);
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			copyStatus = { id, ok: false };
			return;
		}
		trackEvent({ name: event, properties: { source: "command-palette" } });
		copyStatus = { id, ok: true };
		closeTimer = setTimeout(closeDialog, 600);
	}
	function isCopied(id: "install" | "prompt") {
		return copyStatus?.id === id && copyStatus.ok;
	}
	function copyLabel(id: "install" | "prompt", label: string) {
		if (copyStatus?.id !== id) return label;
		return copyStatus.ok ? "Copied" : "Couldn't copy, try again";
	}

	function handleKeyDown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === "k") {
			e.preventDefault();
			handleOpenChange();
			open = !open;
		}
	}

	function closeDialog() {
		handleOpenChange();
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
	onclick={() => {
		handleOpenChange();
		open = true;
	}}
	aria-label="Jump to pages, components, and docs"
	class={cn(
		"text-muted-foreground hover:text-foreground mr-2.5 hidden w-48 justify-start bg-transparent font-normal md:flex dark:bg-transparent",
		className
	)}
>
	<SearchIcon class="size-3.5" />
	<span>Search...</span>
	<Kbd class="text-muted-foreground/70 ml-auto bg-transparent">⌘K</Kbd>
</Button>

<Command.Dialog
	bind:open
	onOpenChange={handleOpenChange}
	title="Search..."
	description="Jump to pages, components, and docs"
>
	<Command.Input placeholder="Search..." class="h-full border-none text-sm" />
	<Command.List class="max-h-[296px]">
		<Command.Empty class="text-muted-foreground py-8 text-sm">
			<div class="flex flex-col items-center gap-1.5">
				<FileText class="size-5 opacity-40" />
				<span>No results found</span>
			</div>
		</Command.Empty>
		{#each siteNavigation as group (group.title)}
			<Command.Group heading={group.title}>
				{#each group.items as item (item.href)}
					<Command.LinkItem href={item.href} value={item.title} onclick={closeDialog}>
						<item.icon />
						<span>{item.title}</span>
					</Command.LinkItem>
				{/each}
			</Command.Group>
		{/each}
		<Command.Group heading="Actions">
			<Command.Item
				value="Toggle theme"
				keywords={["switch", "dark", "light", "mode", "appearance"]}
				onSelect={() => runAction(toggleTheme)}
			>
				{#if $theme === "dark"}<Sun />{:else}<Moon />{/if}
				<span>Switch to {$theme === "dark" ? "light" : "dark"} theme</span>
				<Kbd class="ml-auto">{THEME_HOTKEY.toUpperCase()}</Kbd>
			</Command.Item>
			<Command.Item
				value="Open GitHub repository"
				keywords={["source", "star", "repo", "code"]}
				onSelect={() =>
					runAction(() => {
						window.open(githubRepoUrl, "_blank", "noopener,noreferrer");
					})}
			>
				<GitHubIcon /><span>Open GitHub repository</span>
			</Command.Item>
			<Command.Item
				value="Copy install command"
				keywords={["npx", "shadcn", "cli", "add"]}
				onSelect={() => copy("install", mapInstallCommand, "copy_install_command")}
			>
				{#if isCopied("install")}<Check />{:else}<Terminal />{/if}<span aria-live="polite"
					>{copyLabel("install", "Copy install command")}</span
				>
			</Command.Item>
			<Command.Item
				value="Copy prompt for your agent"
				keywords={["ai", "llm", "claude", "cursor"]}
				onSelect={() => copy("prompt", mapInstallAgentPrompt, "copy_agent_prompt")}
			>
				{#if isCopied("prompt")}<Check />{:else}<Bot />{/if}<span aria-live="polite"
					>{copyLabel("prompt", "Copy prompt for your agent")}</span
				>
			</Command.Item>
		</Command.Group>
	</Command.List>
	<div
		class="text-muted-foreground bg-muted/30 mt-1 flex items-center justify-between border-t px-5 py-2.5 text-xs"
	>
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
