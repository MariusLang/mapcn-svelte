<script lang="ts">
	import { cn } from "$lib/utils";
	import CopyButton from "$lib/components/CopyButton.svelte";
	import CodeSurface from "$lib/components/CodeSurface.svelte";
	import { Button } from "$lib/registry/ui/button/index.js";
	import * as Select from "$lib/registry/ui/select";

	let codeId = $props.id();

	interface CodeFile {
		name: string;
		code: string;
		highlightedCode: string;
	}

	let {
		code,
		highlightedCode,
		files,
		height = "420px",
		class: className,
		children,
	}:
		| {
				code: string;
				highlightedCode: string;
				files?: undefined;
				height?: string;
				class?: string;
				children?: import("svelte").Snippet;
		  }
		| {
				code?: undefined;
				highlightedCode?: undefined;
				files: CodeFile[];
				height?: string;
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

<div
	class={cn("w-full overflow-hidden rounded-lg border", className)}
	style={`--preview-height: ${height}`}
>
	<!-- Preview -->
	<div class="h-(--preview-height) w-full overflow-hidden">
		{@render children?.()}
	</div>

	<!-- Code block -->
	<div class="relative w-full overflow-hidden border-t">
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

		<CodeSurface
			id={codeId}
			class={cn(codeExpanded ? "max-h-[420px] overflow-auto" : "max-h-36 overflow-hidden")}
			html={currentFile.highlightedCode}
		/>

		{#if !codeExpanded}
			<div
				class="from-surface to-surface/0 pointer-events-none absolute inset-x-0 bottom-0 flex w-full items-center justify-center bg-linear-to-t pt-22 pb-4"
			>
				<Button
					variant="outline"
					size="sm"
					onclick={() => (codeExpanded = true)}
					aria-expanded={codeExpanded}
					aria-controls={codeId}
					class="bg-background hover:bg-muted dark:bg-background dark:hover:bg-muted pointer-events-auto"
				>
					View Code
				</Button>
			</div>
		{/if}
	</div>
</div>
