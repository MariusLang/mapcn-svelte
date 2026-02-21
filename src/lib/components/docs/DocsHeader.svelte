<script lang="ts">
	import { page } from "$app/state";
	import { cn } from "$lib/utils";
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
		<ol
			class="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5"
		>
			<li class="inline-flex items-center gap-1.5">
				<a href="/docs" class="hover:text-foreground transition-colors">Docs</a>
			</li>
			<li aria-hidden="true" class="inline-flex items-center gap-1.5">
				<span class="text-muted-foreground/80">/</span>
			</li>
			<li class="inline-flex items-center gap-1.5">
				<a href={groupHref} class="hover:text-foreground transition-colors">
					{activeItem?.groupTitle ?? "Overview"}
				</a>
			</li>
			{#if pathname !== "/docs" && pathname !== "/docs/basic-map"}
				<li aria-hidden="true" class="inline-flex items-center gap-1.5">
					<span class="text-muted-foreground/80">/</span>
				</li>
				<li class="text-foreground inline-flex min-w-0 items-center gap-1.5 truncate font-normal">
					<span>{activeItem?.title ?? "Documentation"}</span>
				</li>
			{/if}
		</ol>
	</nav>
</header>
