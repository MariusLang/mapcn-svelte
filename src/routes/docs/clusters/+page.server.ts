import { docsExampleLoader } from "$lib/docs-example-loader";

export const load = async () => {
	const clusterExample = await docsExampleLoader.single("ClusterExample");

	return {
		clusterSource: clusterExample.source,
		clusterHighlighted: clusterExample.highlighted,
	};
};
