<script lang="ts">
	import { Map, MapMarker, MarkerContent, MarkerTooltip } from "$lib/components/ui/map";
	import Zap from "@lucide/svelte/icons/zap";
	import ExampleCard from "$lib/components/home/ExampleCard.svelte";
</script>

<ExampleCard label="EV Charging" class="aspect-square" delay="delay-700">
	<Map center={[-122.425, 37.777]} zoom={11.5}>
		<MapMarker longitude={-122.4194} latitude={37.7749}>
			<MarkerContent>
				<div class="rounded-full bg-emerald-500 p-1.5 shadow-lg shadow-emerald-500/30">
					<Zap class="size-3 fill-white text-white" />
				</div>
			</MarkerContent>
			<MarkerTooltip>
				<div class="space-y-0.5 text-xs">
					<div class="font-medium">Market St Station</div>
					<div class="flex items-center gap-1">
						<span class="size-1.5 rounded-full bg-emerald-500"></span>
						<span class="text-emerald-500">Available</span>
					</div>
					<div class="text-muted-foreground">150 kW - $0.35/kWh</div>
				</div>
			</MarkerTooltip>
		</MapMarker>

		<MapMarker longitude={-122.4094} latitude={37.7849}>
			<MarkerContent>
				<div class="rounded-full bg-emerald-500 p-1.5 shadow-lg shadow-emerald-500/30">
					<Zap class="size-3 fill-white text-white" />
				</div>
			</MarkerContent>
			<MarkerTooltip>
				<div class="space-y-0.5 text-xs">
					<div class="font-medium">Union Square</div>
					<div class="flex items-center gap-1">
						<span class="size-1.5 rounded-full bg-emerald-500"></span>
						<span class="text-emerald-500">2 Available</span>
					</div>
					<div class="text-muted-foreground">50 kW - $0.28/kWh</div>
				</div>
			</MarkerTooltip>
		</MapMarker>

		<MapMarker longitude={-122.4294} latitude={37.7689}>
			<MarkerContent>
				<div class="rounded-full bg-amber-500 p-1.5 shadow-lg shadow-amber-500/30">
					<Zap class="size-3 fill-white text-white" />
				</div>
			</MarkerContent>
			<MarkerTooltip>
				<div class="space-y-0.5 text-xs">
					<div class="font-medium">Castro Station</div>
					<div class="flex items-center gap-1">
						<span class="size-1.5 rounded-full bg-amber-500"></span>
						<span class="text-amber-500">In Use</span>
					</div>
					<div class="text-muted-foreground">~15 min remaining</div>
				</div>
			</MarkerTooltip>
		</MapMarker>

		<MapMarker longitude={-122.4394} latitude={37.7809}>
			<MarkerContent>
				<div class="rounded-full bg-zinc-400 p-1.5 shadow-lg">
					<Zap class="size-3 fill-white text-white" />
				</div>
			</MarkerContent>
			<MarkerTooltip>
				<div class="space-y-0.5 text-xs">
					<div class="font-medium">Hayes Valley</div>
					<div class="flex items-center gap-1">
						<span class="size-1.5 rounded-full bg-zinc-400"></span>
						<span class="text-muted-foreground">Offline</span>
					</div>
				</div>
			</MarkerTooltip>
		</MapMarker>
	</Map>
</ExampleCard>
