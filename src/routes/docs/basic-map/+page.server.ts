import { docsExampleLoader } from "$lib/docs-example-loader";

export const load = async () => {
	const [basicMapExample, blankMapExample, controlledMapFiles, customStyleFiles] =
		await Promise.all([
			docsExampleLoader.single("BasicMapExample"),
			docsExampleLoader.single("BlankMapExample"),
			docsExampleLoader.namedFiles(["ControlledMapExample"]),
			docsExampleLoader.namedFiles(["CustomStyleExample"]),
		]);

	return {
		basicMapSource: basicMapExample.source,
		basicMapHighlighted: basicMapExample.highlighted,
		blankMapSource: blankMapExample.source,
		blankMapHighlighted: blankMapExample.highlighted,

		controlledMapFiles,
		customStyleFiles,
	};
};
