import { docsExampleLoader } from "$lib/docs-example-loader";

export const load = async () => {
	const controlsExample = await docsExampleLoader.single("MapControlsExample");

	return {
		controlsSource: controlsExample.source,
		controlsHighlighted: controlsExample.highlighted,
	};
};
