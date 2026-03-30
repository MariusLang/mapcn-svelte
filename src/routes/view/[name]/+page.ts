import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

const blockComponents: Record<string, () => Promise<{ default: unknown }>> = {
	"analytics-map": () => import("$lib/registry/blocks/analytics-map/Page.svelte"),
	heatmap: () => import("$lib/registry/blocks/heatmap/Page.svelte"),
	"delivery-tracker": () => import("$lib/registry/blocks/delivery-tracker/Page.svelte"),
	"logistics-network": () => import("$lib/registry/blocks/logistics-network/Page.svelte"),
};

export const entries = () => Object.keys(blockComponents).map((name) => ({ name }));

export const load: PageLoad = async ({ params }) => {
	const loader = blockComponents[params.name];
	if (!loader) {
		error(404, `Block "${params.name}" not found`);
	}

	const module = await loader();
	const title = params.name
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");

	return {
		component: module.default,
		name: title,
	};
};
