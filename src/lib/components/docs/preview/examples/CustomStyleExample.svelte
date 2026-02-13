<script lang="ts">
	import { Map } from "$lib/components/ui/map";
	import PitchController from "./CustomStylePitchController.svelte";

	const styles = {
		default: undefined,
		openstreetmap: "https://tiles.openfreemap.org/styles/bright",
		openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
	};

	type StyleKey = keyof typeof styles;

	let style = $state<StyleKey>("default");
	let selectedStyle = $derived(styles[style]);
</script>

<div class="relative h-[400px] w-full">
	<Map
		center={[-0.1276, 51.5074]}
		zoom={15}
		styles={selectedStyle
			? { light: selectedStyle, dark: selectedStyle }
			: undefined}
	>
		<PitchController {style} />
		<div class="absolute top-2 right-2 z-10">
			<select
				bind:value={style}
				class="rounded-md border bg-background px-2 py-1 text-sm text-foreground shadow"
			>
				<option value="default">Default (Carto)</option>
				<option value="openstreetmap">OpenStreetMap</option>
				<option value="openstreetmap3d">OpenStreetMap 3D</option>
			</select>
		</div>
	</Map>
</div>
