import { highlightCode } from "$lib/highlight";
import { getExampleSource } from "$lib/examples";

export const load = async () => {
	const basicMapSource = getExampleSource("BasicMapExample");
	const controlledMapSource = getExampleSource("ControlledMapExample");
	const controlledMapTrackerSource = getExampleSource("ControlledMapViewportTracker");
	const customStyleSource = getExampleSource("CustomStyleExample");
	const customStyleControllerSource = getExampleSource("CustomStylePitchController");

	const controlledMapFiles = await Promise.all(
		[
			{ name: "ControlledMapExample.svelte", code: controlledMapSource },
			{ name: "ControlledMapViewportTracker.svelte", code: controlledMapTrackerSource },
		].map(async (f) => ({
			...f,
			highlightedCode: await highlightCode(f.code, "svelte"),
		}))
	);

	const customStyleFiles = await Promise.all(
		[
			{ name: "CustomStyleExample.svelte", code: customStyleSource },
			{ name: "CustomStylePitchController.svelte", code: customStyleControllerSource },
		].map(async (f) => ({
			...f,
			highlightedCode: await highlightCode(f.code, "svelte"),
		}))
	);

	return {
		basicMapSource,
		basicMapHighlighted: await highlightCode(basicMapSource, "svelte"),

		controlledMapFiles,
		customStyleFiles,
	};
};
