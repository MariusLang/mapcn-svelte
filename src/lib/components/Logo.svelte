<script lang="ts">
	import { cn } from "$lib/utils";
	import MapPin from "@lucide/svelte/icons/map-pin";

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<a href="/" class={cn("flex w-fit items-center gap-1.5", className)}>
	<MapPin class="size-4 shrink-0" />
	<span class="text-lg font-semibold tracking-tight">mapcn-svelte</span>
</a>
