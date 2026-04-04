<script lang="ts">
	import { Map } from "$lib/components/ui/map";
	import MapLibreGL from "maplibre-gl";

	const styles = {
		default: undefined,
		openstreetmap: "https://tiles.openfreemap.org/styles/bright",
		openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
	};

	type StyleKey = keyof typeof styles;

	let style = $state<StyleKey>("default");
	let selectedStyle = $derived(styles[style]);
	let stylesConfig = $derived(
		selectedStyle ? { light: selectedStyle, dark: selectedStyle } : undefined
	);

	let mapInstance = $state<MapLibreGL.Map | null>(null);

	function handleStyleLoaded() {
		mapInstance?.easeTo({ pitch: style === "openstreetmap3d" ? 60 : 0, duration: 500 });
	}
</script>

<div class="relative h-[420px] w-full">
	<Map
		center={[-0.1276, 51.5074]}
		zoom={15}
		styles={stylesConfig}
		bind:map={mapInstance}
		onstyleloaded={handleStyleLoaded}
	>
		<div class="absolute top-2 right-2 z-10">
			<select
				bind:value={style}
				class="bg-background text-foreground rounded-md border px-2 py-1 text-sm shadow"
			>
				<option value="default">Default (Carto)</option>
				<option value="openstreetmap">OpenStreetMap</option>
				<option value="openstreetmap3d">OpenStreetMap 3D</option>
			</select>
		</div>
	</Map>
</div>
