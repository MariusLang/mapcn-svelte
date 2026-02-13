import { highlightCode } from "$lib/highlight";
import { getExampleSource } from "$lib/examples";

export const load = async () => {
	const basicMapSource = getExampleSource("BasicMapExample");
	const controlledMapSource = getExampleSource("ControlledMapExample");
	const customStyleSource = getExampleSource("CustomStyleExample");

	return {
		basicMapSource,
		basicMapHighlighted: await highlightCode(basicMapSource, "svelte"),

		controlledMapSource,
		controlledMapHighlighted: await highlightCode(controlledMapSource, "svelte"),

		customStyleSource,
		customStyleHighlighted: await highlightCode(customStyleSource, "svelte"),
	};
};
