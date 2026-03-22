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

<Card.Root>
	<Card.Header class="pb-3">
		<Card.Title class="text-sm font-medium">{title}</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-3">
		<div
			class="text-muted-foreground mb-2 flex items-center justify-between text-[11px] tracking-wider uppercase"
		>
			<span>{title}</span>
			<span>Visitors</span>
		</div>
		{#each rows as row}
			<div class="space-y-1">
				<div class="flex items-center justify-between text-xs">
					<span class="text-foreground/90 truncate">{row.label}</span>
					<span class="text-foreground font-medium">{row.value}%</span>
				</div>
				<div class="bg-muted h-1 w-full overflow-hidden rounded-full">
					<div
						class="h-full rounded-full bg-blue-500/85"
						style="width: {(row.value / maxRowValue) * 100}%"
					></div>
				</div>
			</div>
		{/each}
	</Card.Content>
</Card.Root>
