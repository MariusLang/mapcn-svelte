import { highlightCode } from "$lib/highlight";
import { getExampleSource } from "$lib/examples";

export const load = async () => {
	const basicMapSource = getExampleSource("BasicMapExample");

	return {
		basicMapSource,
		basicMapHighlighted: await highlightCode(basicMapSource, "svelte"),
	};
};
