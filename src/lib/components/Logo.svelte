<script lang="ts">
	import { cn } from "$lib/utils";

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
		{@render logoMark()}
		mapcn-svelte
	</a>
{:else}
	<div class={cn("flex items-center gap-1.5 text-lg font-semibold", className)}>
		{@render logoMark()}
		mapcn-svelte
	</div>
{/if}

{#snippet logoMark()}
	<svg viewBox="9 6 14 20" aria-hidden="true" class="h-4 w-auto shrink-0">
		<path
			d="M16 6C12.134 6 9 9.134 9 13C9 18.25 16 26 16 26C16 26 23 18.25 23 13C23 9.134 19.866 6 16 6Z"
			class="fill-svelte"
		/>
		<circle cx="16" cy="13" r="2.5" class="fill-background" />
	</svg>
{/snippet}
