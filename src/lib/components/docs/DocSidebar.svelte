<script lang="ts">
	import { page } from "$app/state";

	import {
		Map,
		BookOpen,
		Code,
		Braces,
		MapPin,
		MessageSquare,
		Route,
		Settings,
	} from "lucide-svelte";

	import * as Sidebar from "$lib/registry/ui/sidebar";

	const navigation = [
		{
			title: "Basics",
			items: [
				{ title: "Getting Started", href: "/docs", icon: BookOpen },
				{ title: "Installation", href: "/docs/installation", icon: Code },
				{ title: "API Reference", href: "/docs/api-reference", icon: Braces },
			],
		},
		{
			title: "Components",
			items: [
				{ title: "Map", href: "/docs/basic-map", icon: Map },
				{ title: "Controls", href: "/docs/controls", icon: Settings },
				{ title: "Markers", href: "/docs/markers", icon: MapPin },
				{ title: "Popups", href: "/docs/popups", icon: MessageSquare },
				{ title: "Routes", href: "/docs/routes", icon: Route },
			],
		},
	];

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
								>
									<a
										href={item.href}
										class="flex items-center gap-2"
										onclick={() => setOpenMobile(false)}
									>
										<item.icon class="size-4" />
										<span>{item.title}</span>
									</a>
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
</Sidebar.Root>
