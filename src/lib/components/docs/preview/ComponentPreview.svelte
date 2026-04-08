<script lang="ts">
	import { cn } from "$lib/utils";
	import CopyButton from "$lib/components/CopyButton.svelte";
	import { Button } from "$lib/registry/ui/button/index.js";
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

	let codeExpanded = $state(false);

	const allFiles = $derived(
		files ? files : [{ name: "index.svelte", code: code!, highlightedCode: highlightedCode! }]
	);

	let selectedFileIndex = $state("0");

	let currentFile = $derived(allFiles[Number(selectedFileIndex)] || allFiles[0]);
</script>

<div class="space-y-4">
	<!-- Preview -->
	<div class={cn("h-[420px] w-full overflow-hidden rounded-lg border", className)}>
		{@render children?.()}
	</div>

	<!-- Code block -->
	<div class="relative w-full overflow-hidden rounded-lg border">
		{#if allFiles.length > 1}
			<div class="bg-muted/40 flex h-12 items-center justify-between border-b ps-1.5 pe-2">
				<Select.Root type="single" bind:value={selectedFileIndex}>
					<Select.Trigger class="w-auto max-w-72 min-w-64 text-xs sm:max-w-full">
						<span class="truncate">{currentFile.name}</span>
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each allFiles as file, i}
								<Select.Item value={i.toString()} label={file.name}>
									<span>{file.name}</span>
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
				<CopyButton command={currentFile.code} />
			</div>
		{:else}
			<div class="absolute top-2 right-2 z-10">
				<CopyButton command={currentFile.code} />
			</div>
		{/if}

		<div
			class={cn(
				"bg-muted/40 overflow-hidden p-4 text-sm transition-[max-height] [&_code]:bg-transparent! [&_pre]:bg-transparent!",
				codeExpanded ? "max-h-[420px] overflow-auto" : "max-h-44"
			)}
		>
			{@html currentFile.highlightedCode}
		</div>

		<div
			class={cn(
				"absolute inset-x-0 bottom-0 flex w-full items-center justify-center",
				!codeExpanded && "from-background to-background/0 bg-linear-to-t pt-12 pb-6"
			)}
		>
			{#if !codeExpanded}
				<Button
					variant="outline"
					size="sm"
					onclick={() => (codeExpanded = true)}
					class="bg-background hover:bg-muted dark:bg-background dark:hover:bg-muted"
				>
					View Code
				</Button>
			{/if}
		</div>
	</div>
</div>
