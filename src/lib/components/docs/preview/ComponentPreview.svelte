<script lang="ts">
	import { cn } from "$lib/utils";
	import CopyButton from "$lib/components/CopyButton.svelte";
	import * as Select from "$lib/registry/ui/select";

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

	// Use string to satisfy Select component types
	let selectedFileIndex = $state("0");

	// Get currently selected file
	let currentFile = $derived(allFiles[Number(selectedFileIndex)] || allFiles[0]);
</script>

<div class="w-full overflow-hidden rounded-lg border">
	<div class="bg-muted/30 flex h-12 items-center justify-between border-b px-2">
		<div class="flex items-center gap-2">
			<button
				onclick={() => (activeTab = "preview")}
				class={cn(
					"rounded px-2 py-1 text-xs font-medium whitespace-nowrap transition-colors",
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
					"rounded px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
					activeTab === "code"
						? "bg-muted text-foreground dark:bg-muted/80"
						: "text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/80"
				)}
			>
				Code
			</button>
		</div>

		<div class="flex items-center gap-2">
			{#if activeTab === "code" && allFiles.length > 1}
				<Select.Root type="single" bind:value={selectedFileIndex}>
					<Select.Trigger class="ms-2 w-auto max-w-40 text-xs sm:max-w-full">
						<span class="truncate">{currentFile.name}</span>
					</Select.Trigger>
					<Select.Content>
						{#each allFiles as file, i}
							<Select.Item value={i.toString()} label={file.name}>
								<span class="">{file.name}</span>
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/if}

			{#if allFiles.length === 1 || activeTab === "code"}
				<CopyButton command={currentFile.code} />
			{/if}
		</div>
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
