<script lang="ts">
	import { Slider as SliderPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		class: className,
		...restProps
	}: Omit<
		Extract<SliderPrimitive.RootProps, { type: "single" }>,
		"type" | "value" | "children" | "child"
	> & {
		value?: number;
		onValueChange?: (value: number) => void;
	} = $props();
</script>

<SliderPrimitive.Root
	type="single"
	bind:value
	{min}
	{max}
	class={cn(
		"relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
		className
	)}
	{...restProps}
>
	{#snippet children({ thumbItems })}
		<span
			class="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
			data-orientation={restProps.orientation ?? "horizontal"}
		>
			<SliderPrimitive.Range
				class="bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
			/>
		</span>
		{#each thumbItems as { index } (index)}
			<SliderPrimitive.Thumb
				{index}
				aria-label={restProps["aria-label"]}
				class="border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
			/>
		{/each}
	{/snippet}
</SliderPrimitive.Root>
