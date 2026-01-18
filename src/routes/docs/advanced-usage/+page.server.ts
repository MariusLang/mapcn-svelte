import { highlightCode } from "$lib/highlight";
import { getExampleSource } from "$lib/examples";

export const load = async () => {
	const advancedUsageSource = getExampleSource("AdvancedUsageExample");
	const customLayerSource = getExampleSource("CustomLayerExample");
	const layerMarkersSource = getExampleSource("LayerMarkersExample");

	return {
		advancedUsageSource,
		advancedUsageHighlighted: await highlightCode(advancedUsageSource, "svelte"),
		customLayerSource,
		customLayerHighlighted: await highlightCode(customLayerSource, "svelte"),
		layerMarkersSource,
		layerMarkersHighlighted: await highlightCode(layerMarkersSource, "svelte"),
	};
};
