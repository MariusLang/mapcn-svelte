import { highlightCode } from "$lib/highlight";
import { getExampleSource } from "$lib/examples";

export const load = async () => {
	const controlsSource = getExampleSource("MapControlsExample");

	return {
		controlsSource,
		controlsHighlighted: await highlightCode(controlsSource, "svelte"),
	};
};
