<script lang="ts">
	import Check from "@lucide/svelte/icons/check";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";
	import Copy from "@lucide/svelte/icons/copy";
	import { mapInstallCommand } from "$lib/llm-prompts";
	import { trackEvent } from "$lib/events";
	import { Button } from "$lib/registry/ui/button";
	import PageActions from "./PageActions.svelte";
	import PageHeader from "./PageHeader.svelte";
	import PageHeaderDescription from "./PageHeaderDescription.svelte";
	import PageHeaderHeading from "./PageHeaderHeading.svelte";

	let copyStatus = $state<"idle" | "copied" | "failed">("idle");
	let reset: ReturnType<typeof setTimeout>;

	async function copyInstallCommand() {
		clearTimeout(reset);
		try {
			await navigator.clipboard.writeText(mapInstallCommand);
			copyStatus = "copied";
			trackEvent({
				name: "copy_install_command",
				properties: { name: "map", source: "hero" },
			});
		} catch {
			copyStatus = "failed";
		}
		reset = setTimeout(() => (copyStatus = "idle"), 2000);
	}
</script>

<PageHeader class="pt-7 pb-12 md:pt-12 md:pb-14 lg:pt-16">
	<a
		href="/docs/skill"
		class="animate-fade-up animate-stagger bg-muted/50 text-foreground/80 ring-foreground/5 hover:bg-muted dark:bg-muted/30 -mb-1 inline-flex items-center gap-0.5 rounded-full py-1 pr-1.5 pl-2.5 text-xs font-medium ring-1"
		style="--stagger: 0"
	>
		Agent skill for mapcn-svelte
		<ChevronRight class="size-3.5" aria-hidden="true" />
	</a>
	<PageHeaderHeading>Beautiful maps, made simple</PageHeaderHeading>
	<PageHeaderDescription class="text-balance sm:text-wrap">
		Ready to use, customizable map components for Svelte.
		<br class="hidden sm:block" />
		Built on MapLibre. Styled with Tailwind.
	</PageHeaderDescription>
	<PageActions class="w-full min-w-0 gap-4 max-sm:flex-col">
		<button
			type="button"
			onclick={copyInstallCommand}
			title="Copy install command"
			aria-label="Copy install command"
			class="bg-surface ring-foreground/10 focus-visible:ring-ring/50 hover:bg-muted inline-flex h-10 max-w-full min-w-0 items-center gap-2 rounded-lg px-4 font-mono text-[13px] ring-1 transition-colors outline-none focus-visible:ring-[3px]"
		>
			<code class="truncate">{mapInstallCommand}</code>
			{#if copyStatus === "copied"}
				<Check class="text-muted-foreground ml-1 size-3.5 shrink-0" aria-hidden="true" />
			{:else}
				<Copy class="text-muted-foreground ml-1 size-3.5 shrink-0" aria-hidden="true" />
			{/if}
		</button>
		<span class="sr-only" aria-live="polite">
			{copyStatus === "copied"
				? "Install command copied"
				: copyStatus === "failed"
					? "Could not copy the install command"
					: ""}
		</span>
		<Button href="/docs" size="lg" class="rounded-lg">Get Started</Button>
	</PageActions>
</PageHeader>
