<script lang="ts">
	import { Button } from "$lib/registry/ui/button/index.js";
	import { Kbd, KbdGroup } from "$lib/registry/ui/kbd";
	import * as Tooltip from "$lib/registry/ui/tooltip";
	import { cn } from "$lib/utils.js";
	import PanelLeftIcon from "@lucide/svelte/icons/panel-left";
	import type { ComponentProps } from "svelte";
	import { useSidebar } from "./context.svelte.js";
	import { SIDEBAR_KEYBOARD_SHORTCUT } from "./constants.js";

	let {
		// eslint-disable-next-line no-useless-assignment
		ref = $bindable(null),
		class: className,
		onclick,
		...restProps
	}: ComponentProps<typeof Button> & {
		onclick?: (e: MouseEvent) => void;
	} = $props();

	const sidebar = useSidebar();
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<Button
				data-sidebar="trigger"
				data-slot="sidebar-trigger"
				variant="ghost"
				size="icon"
				class={cn("size-7", className)}
				type="button"
				onclick={(e) => {
					onclick?.(e);
					sidebar.toggle();
				}}
				{...props}
				{...restProps}
			>
				<PanelLeftIcon />
				<span class="sr-only">Toggle Sidebar</span>
			</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content class="flex items-center gap-2">
		Toggle Sidebar
		<KbdGroup>
			<Kbd>⌘</Kbd>
			<Kbd>{SIDEBAR_KEYBOARD_SHORTCUT.toUpperCase()}</Kbd>
		</KbdGroup>
	</Tooltip.Content>
</Tooltip.Root>
