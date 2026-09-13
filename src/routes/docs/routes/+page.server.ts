import { docsExampleLoader } from "$lib/docs-example-loader";

export const load = async () => {
	const [routeExample, osrmRouteExample, routeProgressExample] = await Promise.all([
		docsExampleLoader.single("RouteExample"),
		docsExampleLoader.single("OsrmRouteExample"),
		docsExampleLoader.single("RouteProgressExample"),
	]);

	return {
		routeProgressSource: routeProgressExample.source,
		routeProgressHighlighted: routeProgressExample.highlighted,
		routeSource: routeExample.source,
		routeHighlighted: routeExample.highlighted,

		osrmRouteSource: osrmRouteExample.source,
		osrmRouteHighlighted: osrmRouteExample.highlighted,
	};
};
