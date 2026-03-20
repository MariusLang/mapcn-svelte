import { docsExampleLoader } from "$lib/docs-example-loader";

export const load = async () => {
	const [basicMapExample, controlledMapFiles, customStyleFiles] = await Promise.all([
		docsExampleLoader.single("BasicMapExample"),
		docsExampleLoader.namedFiles(["ControlledMapExample", "ControlledMapViewportTracker"]),
		docsExampleLoader.namedFiles(["CustomStyleExample", "CustomStylePitchController"]),
	]);

	return {
		basicMapSource: basicMapExample.source,
		basicMapHighlighted: basicMapExample.highlighted,

		controlledMapFiles,
		customStyleFiles,
	};
};
