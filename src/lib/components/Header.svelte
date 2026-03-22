<script lang="ts">
	import { cn } from "$lib/utils";
	import { Separator } from "$lib/registry/ui/separator/index";
	import GitHubButton from "$lib/components/GitHubButton.svelte";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import CommandSearch from "$lib/components/CommandSearch.svelte";
	import MobileNav from "$lib/components/MobileNav.svelte";
	import Logo from "$lib/components/Logo.svelte";
	import { mainNavItems } from "$lib/docs-navigation.js";
	import { Button } from "$lib/registry/ui/button/index.js";

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<header class={cn("bg-background sticky top-0 z-50 h-14 w-full", className)}>
	<nav class="container flex size-full items-center">
		<MobileNav />
		<Logo class="mr-3 hidden shrink-0 lg:flex" />
		<nav class="hidden items-center lg:flex">
			{#each mainNavItems as item}
				<Button variant="ghost" size="sm" href={item.href}>
					{item.title}
				</Button>
			{/each}
		</nav>

		<div class="ml-auto flex h-4.5 items-center gap-2">
			<CommandSearch />
			<Separator orientation="vertical" class="ml-2 hidden md:block" />
			<GitHubButton />
			<Separator orientation="vertical" />
			<ThemeToggle />
		</div>
	</nav>
</header>
