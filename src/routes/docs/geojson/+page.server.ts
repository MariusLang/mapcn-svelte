import { docsExampleLoader } from "$lib/docs-example-loader";

export const load = async () => {
	const [geojsonExample, overlayExample] = await Promise.all([
		docsExampleLoader.single("GeoJSONExample"),
		docsExampleLoader.single("MapOverlayExample"),
	]);

	return {
		geojsonSource: geojsonExample.source,
		geojsonHighlighted: geojsonExample.highlighted,
		overlaySource: overlayExample.source,
		overlayHighlighted: overlayExample.highlighted,
	};
};
