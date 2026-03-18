<script lang="ts">
	import Menu from "@lucide/svelte/icons/menu";
	import { Button } from "$lib/registry/ui/button/index.js";
	import * as Sheet from "$lib/registry/ui/sheet/index.js";
	import { siteNavigation } from "$lib/docs-navigation.js";

	let open = $state(false);
</script>

<Button
	variant="ghost"
	size="icon"
	aria-label="Open menu"
	class="shrink-0 lg:hidden"
	onclick={() => (open = true)}
>
	<Menu class="size-5" />
</Button>

<Sheet.Sheet bind:open>
	<Sheet.SheetContent side="left" class="rounded-r-xl">
		<Sheet.SheetHeader>
			<Sheet.SheetTitle class="sr-only">Navigation</Sheet.SheetTitle>
		</Sheet.SheetHeader>
		<div class="mt-6 overflow-y-auto px-2">
			<nav class="space-y-6">
				{#each siteNavigation as group}
					<div>
						<h3 class="text-muted-foreground mb-2 px-2 text-sm font-medium">
							{group.title}
						</h3>
						<ul>
							{#each group.items as item}
								<li>
									<a
										href={item.href}
										onclick={() => (open = false)}
										class="hover:bg-accent flex items-center rounded-md px-3 py-2.5 text-sm transition-colors"
									>
										{item.title}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</nav>
		</div>
	</Sheet.SheetContent>
</Sheet.Sheet>
