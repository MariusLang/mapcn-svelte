<script lang="ts">
	import { cn } from "$lib/utils";
	import CopyButton from "$lib/components/CopyButton.svelte";
	import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/registry/ui/select";

	interface CodeFile {
		name: string;
		code: string;
		highlightedCode: string;
	}

	let {
		code,
		highlightedCode,
		files,
		class: className,
		children,
	}:
		| {
				code: string;
				highlightedCode: string;
				files?: undefined;
				class?: string;
				children?: import("svelte").Snippet;
		  }
		| {
				code?: undefined;
				highlightedCode?: undefined;
				files: CodeFile[];
				class?: string;
				children?: import("svelte").Snippet;
		  } = $props();

	let activeTab = $state<"preview" | "code">("preview");

	// Determine which files to use
	const allFiles = $derived(
		files ? files : [{ name: "index.svelte", code: code!, highlightedCode: highlightedCode! }]
	);
	let selectedFileIndex = $state(0);

	// Get currently selected file
	const currentFile = $derived(allFiles[selectedFileIndex]);
</script>

<div class="w-full overflow-hidden rounded-lg border">
	<div class="bg-muted/30 flex h-12 items-center justify-between border-b px-2">
		<div class="flex gap-2">
			<button
				onclick={() => (activeTab = "preview")}
				class={cn(
					"rounded px-2 py-1 text-xs font-medium transition-colors",
					activeTab === "preview"
						? "bg-muted text-foreground dark:bg-muted/80"
						: "text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/80"
				)}
			>
				Preview
			</button>

			<button
				onclick={() => (activeTab = "code")}
				class={cn(
					"rounded px-3 py-1 text-xs font-medium transition-colors",
					activeTab === "code"
						? "bg-muted text-foreground dark:bg-muted/80"
						: "text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/80"
				)}
			>
				Code
			</button>
		</div>

		{#if allFiles.length > 1}
			<Select bind:value={selectedFileIndex}>
				<SelectTrigger class="h-8 w-40 text-xs">
					{currentFile.name}
				</SelectTrigger>
				<SelectContent>
					{#each allFiles as file, i}
						<SelectItem value={i.toString()} label={file.name} />
					{/each}
				</SelectContent>
			</Select>
		{/if}

		<CopyButton command={currentFile.code} />
	</div>

	<div class={cn("h-100 overflow-hidden", className)}>
		{#if activeTab === "preview"}
			<div class="h-full">
				{@render children?.()}
			</div>
		{:else}
			<div
				class="bg-muted/20 h-full overflow-auto p-4 text-sm [&_code]:bg-transparent! [&_pre]:bg-transparent!"
			>
				{@html currentFile.highlightedCode}
			</div>
		{/if}
	</div>
</div>
