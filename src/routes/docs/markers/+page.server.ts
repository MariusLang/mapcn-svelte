import { highlightCode } from "$lib/highlight";
import { getExampleSource } from "$lib/examples";

export const load = async () => {
	const markersSource = getExampleSource("MarkersExample");
	const popupSource = getExampleSource("PopupExample");

	return {
		markersSource,
		markersHighlighted: await highlightCode(markersSource, "svelte"),

		popupSource,
		popupHighlighted: await highlightCode(popupSource, "svelte"),
	};
};
