import { highlightCode } from "$lib/highlight";
import { getExampleSource, getExampleSources } from "$lib/examples";

export const load = async () => {
	const advancedUsageSources = getExampleSources(["AdvancedUsageExample", "MapController"]);
	const advancedUsageHighlighted = await Promise.all(
		advancedUsageSources.map((file) => highlightCode(file.code, "svelte"))
	);

	const customLayerSources = getExampleSources(["CustomLayerExample", "CustomLayerContent"]);
	const customLayerHighlighted = await Promise.all(
		customLayerSources.map((file) => highlightCode(file.code, "svelte"))
	);

	const layerMarkersSource = getExampleSource("LayerMarkersExample");
	const layerMarkersHighlighted = await highlightCode(layerMarkersSource, "svelte");

	return {
		advancedUsageFiles: advancedUsageSources.map((file, i) => ({
			name: `${file.name}.svelte`,
			code: file.code,
			highlightedCode: advancedUsageHighlighted[i],
		})),
		customLayerFiles: customLayerSources.map((file, i) => ({
			name: `${file.name}.svelte`,
			code: file.code,
			highlightedCode: customLayerHighlighted[i],
		})),
		layerMarkersSource,
		layerMarkersHighlighted,
	};
};
