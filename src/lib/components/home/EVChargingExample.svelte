<script lang="ts">
	import { Map, MapMarker, MarkerContent, MarkerTooltip } from "$lib/components/ui/map";
	import Zap from "@lucide/svelte/icons/zap";
	import ExampleCard from "$lib/components/home/ExampleCard.svelte";

	type Status = "available" | "in-use" | "offline";

	interface ChargingStation {
		name: string;
		lng: number;
		lat: number;
		status: Status;
		detail: string;
	}

	const stations: ChargingStation[] = [
		{
			name: "Union Square",
			lng: -122.4074,
			lat: 37.7879,
			status: "available",
			detail: "50 kW • $0.28/kWh",
		},
		{
			name: "Castro Station",
			lng: -122.435,
			lat: 37.7625,
			status: "in-use",
			detail: "~15 min remaining",
		},
		{
			name: "Hayes Valley",
			lng: -122.4264,
			lat: 37.7759,
			status: "offline",
			detail: "",
		},
		{
			name: "Embarcadero",
			lng: -122.3934,
			lat: 37.7935,
			status: "available",
			detail: "350 kW • $0.40/kWh",
		},
		{
			name: "Marina District",
			lng: -122.437,
			lat: 37.801,
			status: "available",
			detail: "150 kW • $0.32/kWh",
		},
		{
			name: "SoMa Charger",
			lng: -122.401,
			lat: 37.778,
			status: "available",
			detail: "50 kW • $0.30/kWh",
		},
		{
			name: "Noe Valley",
			lng: -122.431,
			lat: 37.75,
			status: "available",
			detail: "150 kW • $0.33/kWh",
		},
		{
			name: "Richmond Charger",
			lng: -122.478,
			lat: 37.781,
			status: "in-use",
			detail: "~8 min remaining",
		},
		{
			name: "Potrero Hill",
			lng: -122.401,
			lat: 37.76,
			status: "offline",
			detail: "",
		},
		{
			name: "Mission Bay",
			lng: -122.391,
			lat: 37.77,
			status: "available",
			detail: "350 kW • $0.38/kWh",
		},
		{
			name: "Golden Gate Park",
			lng: -122.466,
			lat: 37.77,
			status: "available",
			detail: "150 kW • $0.34/kWh",
		},
	];

	const statusConfig: Record<Status, { bg: string; label: string; textClass: string }> = {
		available: {
			bg: "bg-emerald-500",
			label: "Available",
			textClass: "text-emerald-500",
		},
		"in-use": {
			bg: "bg-amber-500",
			label: "In Use",
			textClass: "text-amber-500",
		},
		offline: {
			bg: "bg-zinc-400",
			label: "Offline",
			textClass: "text-muted-foreground",
		},
	};
</script>

<ExampleCard class="aspect-square" stagger={7}>
	<Map
		center={[-122.434, 37.776]}
		zoom={11}
		options={{ scrollZoom: false, dragRotate: false, pitchWithRotate: false }}
	>
		{#each stations as station (station.name)}
			{@const config = statusConfig[station.status]}
			<MapMarker longitude={station.lng} latitude={station.lat}>
				<MarkerContent>
					<div class="{config.bg} rounded-full p-1.5 shadow-lg">
						<Zap class="size-3 fill-white text-white" />
					</div>
				</MarkerContent>
				<MarkerTooltip class="bg-popover text-popover-foreground border px-2.5 py-1.5">
					<div class="space-y-1 text-xs">
						<div class="font-medium">{station.name}</div>
						<div class="flex items-center gap-1">
							<span class="size-1.5 rounded-full {config.bg}"></span>
							<span class={config.textClass}>{config.label}</span>
						</div>
						{#if station.detail}
							<div class="text-muted-foreground text-[11px]">
								{station.detail}
							</div>
						{/if}
					</div>
				</MarkerTooltip>
			</MapMarker>
		{/each}
	</Map>
</ExampleCard>
