<script lang="ts">
	import { cn } from "$lib/utils";
	import { MapPin } from "lucide-svelte";
	import { Separator } from "$lib/registry/ui/separator/index";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";

	interface Props {
		class?: string;
		children?: import("svelte").Snippet;
	}

	const { class: className, children }: Props = $props();
</script>

<header class={cn("w-full px-6 py-4", className)}>
	<nav class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			{#if children}
				{@render children()}
			{/if}
			<a href="/" class="flex items-center gap-1.5 transition-opacity hover:opacity-80">
				<MapPin class="size-4" />
				<span class="font-semibold tracking-tight">mapcn-svelte</span>
			</a>
		</div>
		<div class="flex h-4 items-center gap-1.5">
			<Separator orientation="vertical" />
			<ThemeToggle />
		</div>
	</nav>
</header>
