<script lang="ts">
	import Map from "$lib/registry/blocks/map/Map.svelte";
	import MapArc from "$lib/registry/blocks/map/MapArc.svelte";
	import MapControls from "$lib/registry/blocks/map/MapControls.svelte";
	import MapMarker from "$lib/registry/blocks/map/MapMarker.svelte";
	import MarkerContent from "$lib/registry/blocks/map/MarkerContent.svelte";
	import MarkerTooltip from "$lib/registry/blocks/map/MarkerTooltip.svelte";
	import { SidebarTrigger } from "$lib/registry/ui/sidebar/index.js";
	import { Separator } from "$lib/registry/ui/separator/index.js";
	import { modeConfig, regionLabels, statusConfig, type Hub, type Route } from "./data.js";

	interface Props {
		hubs: Hub[];
		routes: Route[];
	}

	const { hubs, routes }: Props = $props();

	const arcs = $derived.by(() => {
		const hubById = Object.fromEntries(hubs.map((h) => [h.id, h]));
		return routes.flatMap((route) => {
			const fromHub = hubById[route.from];
			const toHub = hubById[route.to];
			if (!fromHub || !toHub) return [];
			return [
				{
					id: `${route.from}-${route.to}`,
					from: [fromHub.lng, fromHub.lat] as [number, number],
					to: [toHub.lng, toHub.lat] as [number, number],
					color:
						route.status === "delayed" ? statusConfig.delayed.color : modeConfig[route.mode].color,
				},
			];
		});
	});
</script>

<div class="relative h-full">
	<!-- Legend overlay -->
	<div
		class="border-border/40 bg-background/70 absolute top-4 left-4 z-20 flex items-center gap-3 rounded-lg border px-2.5 py-1.5 backdrop-blur-sm"
	>
		<SidebarTrigger />
		<Separator orientation="vertical" class="h-4!" />
		<div class="flex items-center gap-3 text-xs">
			<div class="flex items-center gap-1.5">
				<span
					class="h-0.5 w-4 shrink-0 rounded-full"
					style="background-color: {modeConfig.air.color}"
				></span>
				<span>{modeConfig.air.label}</span>
			</div>
			<div class="flex items-center gap-1.5">
				<span
					class="h-0.5 w-4 shrink-0 rounded-full"
					style="background-color: {modeConfig.ground.color}"
				></span>
				<span>{modeConfig.ground.label}</span>
			</div>
			<div class="flex items-center gap-1.5">
				<span
					class="h-0.5 w-4 shrink-0 rounded-full"
					style="background-color: {statusConfig.delayed.color}"
				></span>
				<span>{statusConfig.delayed.label}</span>
			</div>
			<div class="bg-border h-4 w-px"></div>
			<div class="flex items-center gap-1.5">
				<div class="size-2.5 shrink-0 rounded-full border border-white bg-blue-500 shadow-sm"></div>
				<span>Hub</span>
			</div>
		</div>
	</div>

	<Map center={[-98, 39]} zoom={4} projection={{ type: "globe" }}>
		<MapControls />
		<MapArc
			data={arcs}
			curvature={0.3}
			paint={{
				"line-color": ["get", "color"],
				"line-width": 2,
				"line-opacity": 0.65,
			}}
			interactive={false}
		/>

		{#each hubs as hub (hub.id)}
			<MapMarker longitude={hub.lng} latitude={hub.lat}>
				<MarkerContent>
					<div class="size-3 rounded-full border-2 border-white bg-blue-500 shadow-md"></div>
				</MarkerContent>
				<MarkerTooltip offset={16} class="bg-background text-foreground border px-2.5 py-1.5">
					<p class="font-medium">{hub.city}</p>
					<p class="text-muted-foreground mt-1">
						{hub.shipments.toLocaleString()} shipments
						<span class="mx-1">•</span>
						{regionLabels[hub.region]}
					</p>
				</MarkerTooltip>
			</MapMarker>
		{/each}
	</Map>
</div>
