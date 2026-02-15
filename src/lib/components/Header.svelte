<script lang="ts">
	import { cn } from "$lib/utils";
	import { MapPin } from "@lucide/svelte";
	//import { Button } from "$lib/registry/ui/button";
	import { Separator } from "$lib/registry/ui/separator/index";
	//import * as Tooltip from "$lib/registry/ui/tooltip/index.js";
	import GitHubButton from "$lib/components/GitHubButton.svelte";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import CommandSearch from "$lib/components/CommandSearch.svelte";

	interface Props {
		class?: string;
		children?: import("svelte").Snippet;
	}

	const { class: className, children }: Props = $props();
</script>

<header class={cn("h-16 w-full", className)}>
	<nav class="container flex size-full items-center justify-between">
		<div class="flex items-center gap-4">
			{#if children}
				{@render children()}
			{/if}
			<a href="/" class="flex items-center gap-1.5 transition-opacity hover:opacity-80">
				<MapPin class="text-svelte size-4" />
				<span class="font-semibold tracking-tight whitespace-nowrap">mapcn-svelte</span>
			</a>
		</div>
		<div class="flex h-4.5 items-center gap-2">
			<CommandSearch />
			<!--<Separator orientation="vertical" class="hidden sm:block" />
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button variant="ghost" size="sm">
							<a
								href="https://github.com/sponsors/MariusLang"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Heart class="inline size-4 items-center align-middle text-pink-500" />
								<span class="hidden align-middle sm:ms-1 sm:inline">Sponsor</span>
							</a>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Sponsor this project</p>
					</Tooltip.Content>
				</Tooltip.Root>-->
			<Separator orientation="vertical" />
			<GitHubButton />
			<Separator orientation="vertical" />
			<ThemeToggle />
		</div>
	</nav>
</header>
