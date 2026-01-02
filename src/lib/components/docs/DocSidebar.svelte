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

	import {
		Sidebar,
		SidebarContent,
		SidebarGroup,
		SidebarGroupContent,
		SidebarGroupLabel,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		useSidebar,
	} from "$lib/registry/ui/sidebar";

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
			title: "Examples",
			items: [
				{ title: "Basic Map", href: "/docs/basic-map", icon: Map },
				{ title: "Map Controls", href: "/docs/controls", icon: Settings },
				{ title: "Markers", href: "/docs/markers", icon: MapPin },
				{ title: "Popups", href: "/docs/popups", icon: MessageSquare },
				{ title: "Routes", href: "/docs/routes", icon: Route },
			],
		},
	];

	const { setOpenMobile } = useSidebar();

	const pathname = $derived(page.url.pathname);
</script>

<Sidebar class="top-14 border-r bg-transparent **:data-[sidebar=sidebar]:bg-transparent">
	<SidebarContent class="pt-4">
		{#each navigation as group}
			<SidebarGroup>
				<SidebarGroupLabel
					class="text-muted-foreground/70 text-[11px] font-medium tracking-wider uppercase"
				>
					{group.title}
				</SidebarGroupLabel>

				<SidebarGroupContent>
					<SidebarMenu>
						{#each group.items as item}
							<SidebarMenuItem>
								<SidebarMenuButton
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
								</SidebarMenuButton>
							</SidebarMenuItem>
						{/each}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		{/each}
	</SidebarContent>
</Sidebar>
