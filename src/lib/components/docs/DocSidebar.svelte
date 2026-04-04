<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";

	import * as Sidebar from "$lib/registry/ui/sidebar";
	import { docsNavigation as navigation } from "$lib/docs-navigation";

	const pathname = $derived(page.url.pathname);
</script>

<Sidebar.Root
	collapsible="none"
	class="sticky top-14 z-30 hidden h-[calc(100svh-3.5rem)] overscroll-none bg-transparent lg:ms-6 lg:flex"
>
	<Sidebar.Content class="no-scrollbar overflow-x-hidden pt-6">
		{#each navigation as group}
			<Sidebar.Group>
				<Sidebar.GroupLabel>
					{group.title}
				</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={pathname === item.href}
									class="font-medium"
									onclick={() => {
										goto(item.href);
									}}
								>
									{item.title}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
</Sidebar.Root>
