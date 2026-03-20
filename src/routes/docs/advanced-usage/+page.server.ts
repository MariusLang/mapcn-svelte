import { docsExampleLoader } from "$lib/docs-example-loader";

export const load = async () => {
	const [advancedUsageFiles, customLayerFiles, layerMarkersExample] = await Promise.all([
		docsExampleLoader.namedFiles(["AdvancedUsageExample", "MapController"]),
		docsExampleLoader.namedFiles(["CustomLayerExample", "CustomLayerContent"]),
		docsExampleLoader.single("LayerMarkersExample"),
	]);

	return {
		advancedUsageFiles,
		customLayerFiles,
		layerMarkersSource: layerMarkersExample.source,
		layerMarkersHighlighted: layerMarkersExample.highlighted,
	};
};
