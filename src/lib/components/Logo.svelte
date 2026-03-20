<script lang="ts">
	import Button from "$lib/registry/ui/button/button.svelte";
	import { cn } from "$lib/utils";
	import MapPin from "@lucide/svelte/icons/map-pin";

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<Button href="/" size="sm" variant="ghost" class={cn("px-2.5 text-base font-semibold", className)}>
	<MapPin class="text-svelte size-4 shrink-0" />
	<span class="text-base font-semibold tracking-tight">mapcn-svelte</span>
</Button>
