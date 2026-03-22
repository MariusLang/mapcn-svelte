<script lang="ts">
	import * as Card from "$lib/registry/ui/card/index.js";
	import type { BreakdownRow } from "./data.js";

	interface Props {
		title: string;
		rows: BreakdownRow[];
	}

	const { title, rows }: Props = $props();

	const total = $derived(rows.reduce((sum, row) => sum + row.value, 0));
</script>

<Card.Root>
	<Card.Header class="pb-3">
		<Card.Title class="text-sm font-medium">{title}</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-2">
		<div
			class="text-muted-foreground mb-2 flex items-center justify-between text-[11px] tracking-wider uppercase"
		>
			<span>{title}</span>
			<span>Visitors</span>
		</div>
		{#each rows as row}
			{@const pct = total > 0 ? Math.round((row.value / total) * 100) : 0}
			<div class="space-y-1">
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground truncate">{row.label}</span>
					<span class="ml-2 shrink-0 font-medium tabular-nums">{pct}%</span>
				</div>
				<div class="bg-muted h-1.5 w-full overflow-hidden rounded-full">
					<div class="h-full rounded-full bg-blue-500" style="width: {pct}%"></div>
				</div>
			</div>
		{/each}
	</Card.Content>
</Card.Root>
