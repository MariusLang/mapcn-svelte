<script lang="ts">
	import { cn } from "$lib/utils";

	interface Props {
		html: string;
		id?: string;
		class?: string;
	}

	const { html, id, class: className }: Props = $props();
</script>

<div {id} class={cn("bg-code no-scrollbar py-4 pr-4 text-sm", className)}>
	{@html html}
</div>
