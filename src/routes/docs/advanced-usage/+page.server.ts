import { docsExampleLoader } from "$lib/docs-example-loader";

export const load = async () => {
	const [advancedUsageFiles, customLayerFiles, layerMarkersExample] = await Promise.all([
		docsExampleLoader.namedFiles(["AdvancedUsageExample"]),
		docsExampleLoader.namedFiles(["CustomLayerExample"]),
		docsExampleLoader.single("LayerMarkersExample"),
	]);

	return {
		advancedUsageFiles,
		customLayerFiles,
		layerMarkersSource: layerMarkersExample.source,
		layerMarkersHighlighted: layerMarkersExample.highlighted,
	};
};
