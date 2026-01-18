<script lang="ts">
	import { Map, MapMarker, MarkerContent, MapRoute } from "$lib/components/ui/map";
	import Bike from "@lucide/svelte/icons/bike";
	import Flame from "@lucide/svelte/icons/flame";
	import Clock from "@lucide/svelte/icons/clock";
	import Route from "@lucide/svelte/icons/route";

	import ExampleCard from "$lib/components/home/ExampleCard.svelte";

	const trailCoordinates: [number, number][] = [
		[-73.95846730810143, 40.80035246904919],
		[-73.9717593682683, 40.78210942124929],
		[-73.98192123136191, 40.76793032580281],
		[-73.97393759456651, 40.76462909128966],
		[-73.97291537521572, 40.765159628993814],
		[-73.96920618484948, 40.7637106622374],
		[-73.96383691302509, 40.77117117897504],
		[-73.9584024523858, 40.76889223221369],
		[-73.9470773638119, 40.784238113060894],
		[-73.95585246901248, 40.78786547226602],
		[-73.94937945594087, 40.79668351998197],
		[-73.9498273526222, 40.797167598041455],
		[-73.95699644240298, 40.80016017872583],
	];

	const start = trailCoordinates[0];
	const end = trailCoordinates[trailCoordinates.length - 1];
</script>

<ExampleCard label="" class="aspect-square" delay="delay-500">
	<div
		class="bg-background/95 border-border/50 absolute top-3 left-3 z-10 rounded-lg border p-3 shadow-lg backdrop-blur-md"
	>
		<div class="mb-2 flex items-center gap-1.5">
			<Bike class="size-3.5 text-emerald-500" />
			<span class="text-xs font-medium">Central Park Loop</span>
		</div>
		<div class="grid grid-cols-3 gap-3 text-center">
			<div>
				<div class="text-muted-foreground mb-0.5 flex items-center justify-center gap-1">
					<Route class="size-3" />
				</div>
				<div class="text-sm font-semibold">6.2</div>
				<div class="text-muted-foreground text-[9px] uppercase">Miles</div>
			</div>
			<div>
				<div class="text-muted-foreground mb-0.5 flex items-center justify-center gap-1">
					<Clock class="size-3" />
				</div>
				<div class="text-sm font-semibold">32</div>
				<div class="text-muted-foreground text-[9px] uppercase">Mins</div>
			</div>
			<div>
				<div class="text-muted-foreground mb-0.5 flex items-center justify-center gap-1">
					<Flame class="size-3" />
				</div>
				<div class="text-sm font-semibold">285</div>
				<div class="text-muted-foreground text-[9px] uppercase">Cal</div>
			</div>
		</div>
	</div>

	<Map center={[-73.97, 40.782]} zoom={11.8}>
		<MapRoute coordinates={trailCoordinates} color="#10b981" width={3} opacity={0.9} />

		<MapMarker longitude={start[0]} latitude={start[1]}>
			<MarkerContent>
				<div class="size-3 rounded-full border-2 border-white bg-emerald-500 shadow-lg"></div>
			</MarkerContent>
		</MapMarker>

		<MapMarker longitude={end[0]} latitude={end[1]}>
			<MarkerContent>
				<div class="size-3 rounded-full border-2 border-white bg-red-500 shadow-lg"></div>
			</MarkerContent>
		</MapMarker>
	</Map>
</ExampleCard>
