<script lang="ts">
	import { page } from "$app/state";
	import { cn } from "$lib/utils";
	import * as Breadcrumb from "$lib/registry/ui/breadcrumb";
	import { SidebarTrigger } from "$lib/registry/ui/sidebar";
	import { docsNavigation, type NavItem } from "$lib/docs-navigation";

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();

	const pathname = $derived(page.url.pathname);

	const activeItem = $derived.by(() => {
		for (const group of docsNavigation) {
			const item = group.items.find((navItem) => navItem.href === pathname);
			if (item) {
				return { ...item, groupTitle: group.title } as NavItem & { groupTitle: string };
			}
		}
		return null;
	});

	const groupHref = $derived.by(() => {
		for (const group of docsNavigation) {
			const item = group.items.find((navItem) => navItem.href === pathname);
			if (item) {
				return group.items[0]?.href ?? "/docs";
			}
		}
		return "/docs";
	});
</script>

<header
	class={cn(
		"bg-background/95 supports-backdrop-filter:bg-background/70 sticky top-0 z-50 w-full p-4 px-6 backdrop-blur",
		className
	)}
>
	<nav class="flex items-center gap-3">
		<SidebarTrigger />
		<div class="bg-border h-4 w-px shrink-0"></div>
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href={groupHref}>
						{activeItem?.groupTitle ?? "Overview"}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				{#if pathname !== "/docs" && pathname !== "/docs/basic-map"}
					<Breadcrumb.Separator />
					<Breadcrumb.Item class="min-w-0 truncate">
						<Breadcrumb.Page>{activeItem?.title ?? "Documentation"}</Breadcrumb.Page>
					</Breadcrumb.Item>
				{/if}
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</nav>
</header>
