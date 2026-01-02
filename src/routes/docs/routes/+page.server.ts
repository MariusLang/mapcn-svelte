import { highlightCode } from "$lib/highlight";
import { getExampleSource } from "$lib/examples";

export const load = async () => {
	const routeSource = getExampleSource("RouteExample");
	const osrmRouteSource = getExampleSource("OsrmRouteExample");

	return {
		routeSource,
		routeHighlighted: await highlightCode(routeSource, "svelte"),

		osrmRouteSource,
		osrmRouteHighlighted: await highlightCode(osrmRouteSource, "svelte"),
	};
};
