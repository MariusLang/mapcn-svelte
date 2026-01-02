import { highlightCode } from "$lib/highlight";
import { getExampleSource } from "$lib/examples";

export const load = async () => {
	const popupSource = getExampleSource("StandalonePopupExample");

	return {
		popupSource,
		popupHighlighted: await highlightCode(popupSource, "svelte"),
	};
};
