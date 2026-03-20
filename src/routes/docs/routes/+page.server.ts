import { docsExampleLoader } from "$lib/docs-example-loader";

export const load = async () => {
	const [routeExample, osrmRouteExample] = await Promise.all([
		docsExampleLoader.single("RouteExample"),
		docsExampleLoader.single("OsrmRouteExample"),
	]);

	return {
		routeSource: routeExample.source,
		routeHighlighted: routeExample.highlighted,

		osrmRouteSource: osrmRouteExample.source,
		osrmRouteHighlighted: osrmRouteExample.highlighted,
	};
};
