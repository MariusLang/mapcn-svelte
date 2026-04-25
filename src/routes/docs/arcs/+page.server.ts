import { docsExampleLoader } from "$lib/docs-example-loader";

export const load = async () => {
	const [arcExample, interactiveArcExample] = await Promise.all([
		docsExampleLoader.single("ArcExample"),
		docsExampleLoader.single("InteractiveArcExample"),
	]);

	return {
		arcSource: arcExample.source,
		arcHighlighted: arcExample.highlighted,
		interactiveArcSource: interactiveArcExample.source,
		interactiveArcHighlighted: interactiveArcExample.highlighted,
	};
};
