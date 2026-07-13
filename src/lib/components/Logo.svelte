<script lang="ts">
	import { cn } from "$lib/utils";
	import MapPin from "@lucide/svelte/icons/map-pin";

	interface Props {
		class?: string;
		onclick?: () => void;
		isLink?: boolean;
	}

	const { class: className, onclick, isLink = true }: Props = $props();
</script>

{#if isLink}
	<a
		href="/"
		{onclick}
		class={cn("flex h-8 items-center gap-1.5 text-lg font-semibold", className)}
	>
		<MapPin class="text-svelte size-4" />
		mapcn-svelte
	</a>
{:else}
	<div class={cn("flex items-center gap-1.5 text-lg font-semibold", className)}>
		<MapPin class="text-svelte size-4" />
		mapcn-svelte
	</div>
{/if}
