<script lang="ts">
	import * as Card from "$lib/registry/ui/card/index.js";
	import type { BreakdownRow } from "./data.js";

	interface Props {
		title: string;
		rows: BreakdownRow[];
	}

	const { title, rows }: Props = $props();

	const maxRowValue = $derived(rows.length > 0 ? Math.max(...rows.map((row) => row.value)) : 0);
</script>

<Card.Root class="gap-2">
	<Card.Header>
		<Card.Title class="text-sm font-medium">{title}</Card.Title>
	</Card.Header>
	<Card.Content>
		<div
			class="text-muted-foreground mb-2 flex items-center justify-between text-[11px] tracking-wider uppercase"
		>
			<span>{title}</span>
			<span>Visitors</span>
		</div>
		<div class="space-y-1.5">
			{#each rows as row}
				{@const pct = maxRowValue ? (row.value / maxRowValue) * 100 : 0}
				<div
					class="relative flex items-center justify-between overflow-hidden rounded-md px-2 py-1.5 text-xs"
				>
					<div
						class="bg-muted-foreground/20 absolute inset-y-0 left-0 rounded-md"
						style="width: {pct}%"
						aria-hidden="true"
					></div>
					<span class="text-foreground/90 relative truncate pr-2">{row.label}</span>
					<span class="text-foreground relative font-medium tabular-nums">
						{row.value.toLocaleString()}
					</span>
				</div>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
