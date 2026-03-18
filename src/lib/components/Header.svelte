<script lang="ts">
	import { cn } from "$lib/utils";
	import { MapPin } from "@lucide/svelte";
	import { Button } from "$lib/registry/ui/button/index.js";
	import { Separator } from "$lib/registry/ui/separator/index";
	import GitHubButton from "$lib/components/GitHubButton.svelte";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import CommandSearch from "$lib/components/CommandSearch.svelte";
	import MobileNav from "$lib/components/MobileNav.svelte";
	import { mainNavItems } from "$lib/docs-navigation.js";

	interface Props {
		class?: string;
		children?: import("svelte").Snippet;
	}

	const { class: className, children }: Props = $props();
</script>

<header class={cn("h-16 w-full border-b", className)}>
	<nav class="container flex size-full items-center justify-between gap-4">
		<div class="flex items-center gap-4">
			<MobileNav />
			{#if children}
				{@render children()}
			{/if}
			<a href="/" class="flex items-center gap-1.5 transition-opacity hover:opacity-80">
				<MapPin class="text-svelte size-4" />
				<span class="font-semibold tracking-tight whitespace-nowrap">mapcn-svelte</span>
			</a>
			<nav class="hidden items-center gap-1 lg:flex">
				{#each mainNavItems as item}
					<Button variant="ghost" size="sm" href={item.href} class="px-2.5">
						{item.title}
					</Button>
				{/each}
			</nav>
		</div>
		<div class="flex h-4.5 items-center gap-2">
			<CommandSearch />
			<Separator orientation="vertical" class="hidden sm:block" />
			<GitHubButton />
			<Separator orientation="vertical" />
			<ThemeToggle />
		</div>
	</nav>
</header>
