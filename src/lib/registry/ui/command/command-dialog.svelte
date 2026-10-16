<script lang="ts">
	import type { Command as CommandPrimitive, Dialog as DialogPrimitive } from "bits-ui";
	import type { Snippet } from "svelte";
	import Command from "./command.svelte";
	import * as Dialog from "$lib/registry/ui/dialog/index.js";
	import type { WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		open = $bindable(false),
		ref = $bindable(null),
		value = $bindable(""),
		title = "Command Palette",
		description = "Search for a command to run",
		portalProps,
		children,
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.RootProps> &
		WithoutChildrenOrChild<CommandPrimitive.RootProps> & {
			portalProps?: DialogPrimitive.PortalProps;
			children: Snippet;
			title?: string;
			description?: string;
		} = $props();
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Header class="sr-only">
		<Dialog.Title>{title}</Dialog.Title>
		<Dialog.Description>{description}</Dialog.Description>
	</Dialog.Header>
	<Dialog.Content
		showCloseButton={false}
		class="top-[min(22vh,10rem)] translate-y-0 overflow-hidden rounded-xl p-0 shadow-2xl"
		{portalProps}
	>
		<Command
			class="[&_[data-command-group-heading]]:text-muted-foreground [&_[data-command-group-heading]]:px-3 [&_[data-command-group-heading]]:pt-3 [&_[data-command-group-heading]]:font-medium [&_[data-command-group]]:px-2 [&_[data-command-group]:not([hidden])_~[data-command-group]]:pt-0 [&_[data-command-item]]:gap-3 [&_[data-command-item]]:rounded-lg [&_[data-command-item]]:px-3 [&_[data-command-item]]:py-2.5 [&_[data-command-item]_svg]:size-4"
			{...restProps}
			bind:value
			bind:ref
			{children}
		/>
	</Dialog.Content>
</Dialog.Root>
