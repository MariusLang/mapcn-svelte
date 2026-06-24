<script lang="ts">
	import { cn } from "$lib/utils";
	import { getNetworkSummary, statusMeta, type EdgeNode } from "./data";

	let { nodes }: { nodes: EdgeNode[] } = $props();
	const summary = $derived(getNetworkSummary(nodes));
	const summaryMeta = $derived(statusMeta[summary.status]);
</script>

<div class="bg-card flex w-56 shrink-0 flex-col overflow-hidden border-r">
	<div class="border-b p-3">
		<p class="text-foreground text-sm font-semibold">Edge Network</p>

		<div class="mt-2 flex items-center gap-1.5">
			<span class={cn("size-2 rounded-full", summaryMeta.dot)}></span>
			<span class={cn("text-xs font-medium", summaryMeta.text)}>{summary.label}</span>
		</div>

		<div class="mt-3 grid grid-cols-2 gap-2">
			<div class="bg-background/60 rounded-md border p-2">
				<p class="text-muted-foreground text-[10px] tracking-wide uppercase">Uptime</p>
				<p class="text-foreground text-sm font-semibold tabular-nums">
					{summary.avgUptime.toFixed(2)}%
				</p>
			</div>
			<div class="bg-background/60 rounded-md border p-2">
				<p class="text-muted-foreground text-[10px] tracking-wide uppercase">Edges up</p>
				<p class="text-foreground text-sm font-semibold tabular-nums">
					{summary.operational}<span class="text-muted-foreground font-normal"
						>/{summary.total}</span
					>
				</p>
			</div>
		</div>
	</div>

	<ul class="flex-1 divide-y overflow-y-auto">
		{#each nodes as node (node.id)}
			{@const meta = statusMeta[node.status]}
			<li class="flex items-center gap-2.5 px-3 py-2">
				<span class={cn("size-2 shrink-0 rounded-full", meta.dot)}></span>
				<div class="min-w-0 flex-1">
					<p class="text-foreground truncate text-xs font-medium">{node.city}</p>
					<p class="text-muted-foreground truncate text-[10px]">{node.region}</p>
				</div>
				<div class="flex shrink-0 flex-col items-end">
					<span class="text-muted-foreground font-mono text-[10px] uppercase">{node.id}</span>
					<span class="text-foreground font-mono text-[10px] tabular-nums">
						{node.status === "down" ? "—" : `${node.latency}ms`}
					</span>
				</div>
			</li>
		{/each}
	</ul>
</div>
