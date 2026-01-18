import { highlightCode } from "$lib/highlight";
import { getExampleSource } from "$lib/examples";

export const load = async () => {
	const clusterSource = getExampleSource("ClusterExample");

	return {
		clusterSource,
		clusterHighlighted: await highlightCode(clusterSource, "svelte"),
	};
};
