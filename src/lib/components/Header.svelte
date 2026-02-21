<script lang="ts">
	import { cn } from "$lib/utils";
	import { Separator } from "$lib/registry/ui/separator/index";
	import GitHubButton from "$lib/components/GitHubButton.svelte";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import CommandSearch from "$lib/components/CommandSearch.svelte";
	import Logo from "$lib/components/Logo.svelte";

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<header class={cn("container w-full p-4", className)}>
	<nav class="flex size-full items-center justify-between">
		<Logo />
		<div class="flex h-4.5 items-center gap-2">
			<CommandSearch />
			<Separator orientation="vertical" class="hidden sm:block" />
			<!--<Tooltip.Root>
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
				</Tooltip.Root>
			<Separator orientation="vertical" />-->
			<GitHubButton />
			<Separator orientation="vertical" class="hidden sm:block" />
			<ThemeToggle />
		</div>
	</nav>
</header>
