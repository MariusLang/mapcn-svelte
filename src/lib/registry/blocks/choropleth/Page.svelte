<script lang="ts">
	import MapLibreGL from "maplibre-gl";
	import { Map, MapControls, MapGeoJSON, MapPopup } from "$lib/registry/blocks/map";
	import { useWorldData } from "$lib/use-world-data.svelte.js";
	import { theme as appTheme } from "$lib/theme";
	import { mapConfig, visitorsByCountry, type Theme } from "./data";

	interface HoverInfo {
		name: string;
		visitors: number;
		lng: number;
		lat: number;
	}

	interface CountryProperties {
		NAME_LONG: string;
		visitors: number;
	}

	type CountryFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, CountryProperties>;

	let hover = $state<HoverInfo | null>(null);
	let theme = $state<Theme>("light");
	const world = useWorldData();

	const unsubscribe = appTheme.subscribe((value) => {
		theme = value === "dark" ? "dark" : "light";
	});

	$effect(() => () => unsubscribe());

	const countries = $derived.by<CountryFeatureCollection | null>(() => {
		if (!world.data) return null;
		return {
			type: "FeatureCollection",
			features: world.data.features.map((feature) => ({
				...feature,
				properties: {
					NAME_LONG: feature.properties.NAME_LONG,
					visitors: visitorsByCountry[feature.properties.NAME_LONG] ?? 0,
				},
			})),
		};
	});

	function buildFillColor(currentTheme: Theme): unknown[] {
		const { base, ramp, hover: hoverColor } = mapConfig.colors[currentTheme];
		const [s0, s1, s2, s3, s4] = mapConfig.scaleStops;
		const ramped = [
			"interpolate",
			["linear"],
			["coalesce", ["get", "visitors"], 0],
			s0,
			base,
			s1,
			ramp[0],
			s2,
			ramp[1],
			s3,
			ramp[2],
			s4,
			ramp[3],
		];
		return [
			"case",
			[
				"all",
				["boolean", ["feature-state", "hover"], false],
				[">", ["coalesce", ["get", "visitors"], 0], 0],
			],
			hoverColor,
			ramped,
		];
	}

	const fillPaint = $derived<NonNullable<MapLibreGL.FillLayerSpecification["paint"]>>({
		"fill-color": buildFillColor(theme) as never,
		"fill-opacity": 0.92,
	});

	const gradient = $derived(
		`linear-gradient(to right, ${mapConfig.colors[theme].ramp.join(", ")})`
	);
</script>

<div class="bg-card relative h-screen overflow-hidden">
	<Map
		blank
		center={mapConfig.view.center}
		zoom={mapConfig.view.zoom}
		options={{
			minZoom: mapConfig.view.minZoom,
			maxZoom: mapConfig.view.maxZoom,
			dragRotate: false,
			pitchWithRotate: false,
			attributionControl: false,
		}}
	>
		{#if countries}
			<MapGeoJSON
				data={countries}
				promoteId="NAME_LONG"
				{fillPaint}
				interactive
				onhover={(event) => {
					const visitors = event?.feature.properties.visitors ?? 0;
					if (!event || visitors <= 0) {
						hover = null;
						return;
					}
					hover = {
						name: event.feature.properties.NAME_LONG,
						visitors,
						lng: event.longitude,
						lat: event.latitude,
					};
				}}
			/>
		{/if}
		<MapControls class="bottom-2" />
		{#if hover}
			<MapPopup
				longitude={hover.lng}
				latitude={hover.lat}
				offset={12}
				closeOnClick={false}
				class="pointer-events-none p-2"
			>
				<p class="text-xs font-medium">{hover.name}</p>
				<div class="flex items-center justify-between gap-4 pt-1">
					<span class="text-muted-foreground flex items-center gap-1.5 text-[11px]">
						<span class="size-2 rounded-full" style:background-color={mapConfig.colors[theme].hover}
						></span>
						Visitors
					</span>
					<span class="text-foreground text-xs font-semibold tabular-nums">
						{hover.visitors.toLocaleString()}
					</span>
				</div>
			</MapPopup>
		{/if}
	</Map>

	<div
		class="bg-card/90 absolute bottom-4 left-4 z-10 rounded-lg border px-3 py-2.5 backdrop-blur-sm"
	>
		<p class="text-foreground text-xs font-medium">Visitors by country</p>
		<div class="mt-2 h-2 w-40 rounded-full" style:background-image={gradient}></div>
		<div class="text-muted-foreground flex items-center justify-between pt-1.5 text-[10px]">
			<span>Low</span>
			<span>High</span>
		</div>
	</div>
</div>
