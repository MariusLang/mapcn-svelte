<script lang="ts">
	import { cn } from "$lib/utils";
	import CopyButton from "$lib/components/CopyButton.svelte";

	let {
		code,
		highlightedCode,
		class: className,
		children,
	}: {
		code: string;
		highlightedCode: string;
		class?: string;
		children?: import("svelte").Snippet;
	} = $props();

	let activeTab = $state<"preview" | "code">("preview");
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

		<CopyButton command={code} />
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
				{@html highlightedCode}
			</div>
		{/if}
	</div>
</div>
