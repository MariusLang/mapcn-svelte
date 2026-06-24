<script lang="ts">
	import { MapMarker, MarkerContent, MarkerTooltip } from "$lib/registry/blocks/map";
	import { cn } from "$lib/utils";
	import { statusMeta, type EdgeNode } from "./data";

	let { node }: { node: EdgeNode } = $props();
	const meta = $derived(statusMeta[node.status]);
</script>

<MapMarker longitude={node.lng} latitude={node.lat}>
	<MarkerContent>
		<div class="group flex size-4 items-center justify-center">
			<span
				class={cn(
					"inline-flex size-2 rounded-full transition-transform group-hover:scale-125",
					meta.dot
				)}
			></span>
		</div>
	</MarkerContent>
	<MarkerTooltip offset={10} class="bg-popover min-w-28 border p-2">
		<div class="flex items-center gap-1.5">
			<span class={cn("size-1.5 rounded-full", meta.dot)}></span>
			<span class="text-foreground text-[11px] font-medium">{node.city}</span>
			<span class="text-muted-foreground ml-auto font-mono text-[10px] uppercase">{node.id}</span>
		</div>
		<div class="text-muted-foreground mt-1.5 flex items-center justify-between gap-3 text-[10px]">
			<span>{node.status === "down" ? "-" : `${node.latency} ms`}</span>
			<span class="tabular-nums">{node.uptime.toFixed(2)}%</span>
		</div>
	</MarkerTooltip>
</MapMarker>
