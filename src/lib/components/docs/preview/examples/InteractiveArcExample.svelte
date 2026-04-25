<script lang="ts">
	import type { ExpressionSpecification } from "maplibre-gl";
	import {
		Map,
		MapArc,
		MapMarker,
		MapPopup,
		MarkerContent,
		MarkerLabel,
		type MapArcDatum,
	} from "$lib/components/ui/map";

	interface Lane extends MapArcDatum {
		origin: string;
		destination: string;
		volume: string;
		mode: "air" | "sea";
	}

	const lanes: Lane[] = [
		{
			id: "shg-lax",
			origin: "Shanghai",
			destination: "Los Angeles",
			from: [121.4737, 31.2304],
			to: [-118.2437, 34.0522],
			volume: "24.8k TEU",
			mode: "sea",
		},
		{
			id: "sin-rtm",
			origin: "Singapore",
			destination: "Rotterdam",
			from: [103.8198, 1.3521],
			to: [4.4777, 51.9244],
			volume: "9.4k TEU",
			mode: "sea",
		},
		{
			id: "san-cpt",
			origin: "Santos",
			destination: "Cape Town",
			from: [-46.3322, -23.9608],
			to: [18.4241, -33.9249],
			volume: "3.2k TEU",
			mode: "sea",
		},
		{
			id: "syd-nrt",
			origin: "Sydney",
			destination: "Tokyo",
			from: [151.2093, -33.8688],
			to: [139.6917, 35.6895],
			volume: "640 tons",
			mode: "air",
		},
		{
			id: "dxb-jfk",
			origin: "Dubai",
			destination: "New York",
			from: [55.2708, 25.2048],
			to: [-74.006, 40.7128],
			volume: "980 tons",
			mode: "air",
		},
		{
			id: "dxb-bom",
			origin: "Dubai",
			destination: "Mumbai",
			from: [55.2708, 25.2048],
			to: [72.8777, 19.076],
			volume: "1.2k tons",
			mode: "sea",
		},
	];

	const modeColors = {
		air: "#a78bfa",
		sea: "#34d399",
	};

	interface SelectedLane {
		lane: Lane;
		longitude: number;
		latitude: number;
	}

	let selected = $state<SelectedLane | null>(null);

	const endpoints = $derived.by(() => {
		const points: { name: string; coords: [number, number] }[] = [];
		const seen = new Set<string>();
		for (const lane of lanes) {
			if (!seen.has(lane.origin)) {
				seen.add(lane.origin);
				points.push({ name: lane.origin, coords: lane.from });
			}
			if (!seen.has(lane.destination)) {
				seen.add(lane.destination);
				points.push({ name: lane.destination, coords: lane.to });
			}
		}
		return points;
	});

	const modeColorExpression: ExpressionSpecification = [
		"match",
		["get", "mode"],
		"air",
		modeColors.air,
		"sea",
		modeColors.sea,
		"#888",
	];
</script>

<div class="relative h-[420px] w-full">
	<Map center={[20, 20]} zoom={0.8}>
		<MapArc
			data={lanes}
			paint={{
				"line-color": modeColorExpression,
				"line-width": 1.5,
			}}
			hoverPaint={{
				"line-width": 3,
				"line-opacity": 1,
			}}
			onhover={(event) => {
				selected = event
					? { lane: event.arc as Lane, longitude: event.longitude, latitude: event.latitude }
					: null;
			}}
		/>

		{#each endpoints as point (point.name)}
			<MapMarker longitude={point.coords[0]} latitude={point.coords[1]}>
				<MarkerContent>
					<div class="bg-foreground/80 size-2 rounded-full shadow-sm"></div>
					<MarkerLabel position="top" class="text-foreground/80 tracking-tight">
						{point.name}
					</MarkerLabel>
				</MarkerContent>
			</MapMarker>
		{/each}

		{#if selected}
			<MapPopup
				longitude={selected.longitude}
				latitude={selected.latitude}
				offset={12}
				closeOnClick={false}
				class="p-0"
			>
				<div class="flex items-center gap-2 px-2.5 py-1.5 text-xs">
					<span
						class="size-1.5 rounded-full"
						style="background: {selected.lane.mode === 'air' ? modeColors.air : modeColors.sea}"
					></span>
					<span class="font-medium">
						{selected.lane.origin} → {selected.lane.destination}
					</span>
					<span class="text-muted-foreground border-l pl-2">
						{selected.lane.volume}
					</span>
				</div>
			</MapPopup>
		{/if}
	</Map>

	<div
		class="bg-background/80 absolute bottom-3 left-3 flex items-center gap-3 rounded-full border px-3 py-0.5 text-[11px] shadow-sm backdrop-blur"
	>
		<div class="flex items-center gap-1.5">
			<span class="size-1.5 rounded-full" style="background: {modeColors.air}"></span>
			Air
		</div>
		<span class="bg-border h-3 w-px"></span>
		<div class="flex items-center gap-1.5">
			<span class="size-1.5 rounded-full" style="background: {modeColors.sea}"></span>
			Sea
		</div>
	</div>
</div>
