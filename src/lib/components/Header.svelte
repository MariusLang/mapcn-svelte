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

<header
	class={cn(
		"bg-background/85 supports-backdrop-filter:bg-background/70 sticky top-0 z-50 h-14 w-full backdrop-blur",
		className
	)}
>
	<nav class="container flex size-full items-center gap-2 **:data-[slot=separator]:h-4!">
		<MobileNav />
		<Logo class="hidden shrink-0 lg:flex" />
		<Separator orientation="vertical" class="hidden lg:block" />
		<nav class="hidden items-center gap-0.5 lg:flex">
			{#each mainNavItems as item}
				<Button variant="ghost" size="sm" href={item.href} class="px-2.5">
					{item.title}
				</Button>
			{/each}
		</nav>

		<div class="ml-auto flex items-center gap-2">
			<CommandSearch />
			<GitHubButton />
			<ThemeToggle />
		</div>
	</nav>
</header>
