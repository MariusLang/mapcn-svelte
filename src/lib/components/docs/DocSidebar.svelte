<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";

	import * as Sidebar from "$lib/registry/ui/sidebar";
	import { docsNavigation as navigation } from "$lib/docs-navigation";

	const { setOpenMobile } = Sidebar.useSidebar();

	const pathname = $derived(page.url.pathname);
</script>

<Sidebar.Root
	class="sticky top-16 h-[calc(100svh-9.5rem)] border-none bg-transparent **:data-[sidebar=sidebar]:bg-transparent"
>
	<Sidebar.Content class="no-scrollbar mx-4 overflow-x-hidden  pt-8">
		{#each navigation as group}
			<Sidebar.Group>
				<Sidebar.GroupLabel
					class="text-muted-foreground/70 text-[11px] font-medium tracking-wider uppercase"
				>
					{group.title}
				</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={pathname === item.href}
									class="text-muted-foreground hover:text-foreground data-[active=true]:text-foreground data-[active=true]:font-medium"
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
</Sidebar.Root>
