<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import SearchIcon from "@lucide/svelte/icons/search";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		...restProps
	}: CommandPrimitive.InputProps = $props();
</script>

<div
	class="bg-muted m-2 mb-0 flex h-9 items-center gap-3 rounded-lg px-3"
	data-slot="command-input-wrapper"
>
	<SearchIcon class="text-muted-foreground size-4 shrink-0" />
	<CommandPrimitive.Input
		data-slot="command-input"
		class={cn(
			"placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
			className
		)}
		bind:ref
		{...restProps}
		bind:value
	/>
</div>
