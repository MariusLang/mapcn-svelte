import { docsExampleLoader } from "$lib/docs-example-loader";

export const load = async () => {
	const popupExample = await docsExampleLoader.single("StandalonePopupExample");

	return {
		popupSource: popupExample.source,
		popupHighlighted: popupExample.highlighted,
	};
};
