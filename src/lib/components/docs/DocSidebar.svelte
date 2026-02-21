<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";

	import * as Sidebar from "$lib/registry/ui/sidebar";
	import { docsNavigation as navigation } from "$lib/docs-navigation";
	import Logo from "$lib/components/Logo.svelte";
	import CommandSearch from "$lib/components/CommandSearch.svelte";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import GitHubButton from "$lib/components/GitHubButton.svelte";

	const { setOpenMobile } = Sidebar.useSidebar();

	const pathname = $derived(page.url.pathname);
</script>

<Sidebar.Root>
	<Sidebar.Header class="gap-4 p-4 pb-2">
		<Logo />
		<CommandSearch class="flex w-full" />
	</Sidebar.Header>

	<Sidebar.Content>
		{#each navigation as group}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={pathname === item.href}
									class="text-muted-foreground font-medium"
									onclick={() => {
										setOpenMobile(false);
										goto(item.href);
									}}
								>
									<span class="flex items-center gap-2">
										<item.icon class="size-4" />
										<span>{item.title}</span>
									</span>
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>

	<Sidebar.Footer class="border-t">
		<div class="flex justify-between">
			<GitHubButton withCount={false} />
			<ThemeToggle />
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
