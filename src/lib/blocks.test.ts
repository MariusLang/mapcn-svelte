import { describe, expect, it } from "vitest";
import { createFileTreeForRegistryItemFiles, getAllBlocks, getBlockCategories } from "./blocks";

describe("getAllBlocks", () => {
	it("returns only registry blocks with normalized defaults", () => {
		const blocks = getAllBlocks();

		expect(blocks.map((block) => block.name)).toEqual([
			"analytics-map",
			"choropleth",
			"analytics-card",
			"delivery-tracker",
			"uptime-monitor",
			"heatmap",
			"logistics-network",
			"store-locator",
		]);
		expect(blocks.every((block) => block.type === "registry:block")).toBe(true);

		expect(blocks[0]).toMatchObject({
			title: "Analytics Map",
			categories: ["analytics", "dashboard"],
			meta: { iframeHeight: "940px" },
		});
		expect(blocks[0].registryDependencies).toContain("card");
		expect(blocks[0].registryDependencies?.some((d) => d.endsWith("/r/map.json"))).toBe(true);

		expect(blocks[5]).toMatchObject({
			title: "Heatmap",
			files: [
				{ path: "src/lib/registry/blocks/heatmap/Page.svelte", target: "heatmap/+page.svelte" },
				{
					path: "src/lib/registry/blocks/heatmap/GlobeHeatmapLayers.svelte",
					target: "heatmap/GlobeHeatmapLayers.svelte",
				},
			],
			categories: ["visualization", "heatmap"],
			meta: { iframeHeight: "800px" },
		});
		expect(blocks[5].registryDependencies?.some((d) => d.endsWith("/r/map.json"))).toBe(true);
	});
});

describe("createFileTreeForRegistryItemFiles", () => {
	it("builds a nested tree from target paths and merges shared folders", () => {
		const tree = createFileTreeForRegistryItemFiles([
			{
				path: "src/lib/registry/blocks/analytics-map/Page.svelte",
				target: "analytics/+page.svelte",
			},
			{ path: "src/lib/registry/blocks/analytics-map/data.ts", target: "analytics/data.ts" },
			{ path: "src/lib/server/api.ts" },
			{ path: "src/lib/server/routes/index.ts" },
		]);

		expect(tree).toEqual([
			{
				name: "analytics",
				children: [
					{ name: "+page.svelte", path: "analytics/+page.svelte" },
					{ name: "data.ts", path: "analytics/data.ts" },
				],
			},
			{
				name: "src",
				children: [
					{
						name: "lib",
						children: [
							{
								name: "server",
								children: [
									{ name: "api.ts", path: "src/lib/server/api.ts" },
									{
										name: "routes",
										children: [{ name: "index.ts", path: "src/lib/server/routes/index.ts" }],
									},
								],
							},
						],
					},
				],
			},
		]);
	});
});

describe("getBlockCategories", () => {
	it("groups every block once by its primary category in registry order", () => {
		const categories = getBlockCategories();
		expect(categories.map(({ slug, title }) => ({ slug, title }))).toEqual([
			{ slug: "analytics", title: "Analytics" },
			{ slug: "visualization", title: "Visualization" },
			{ slug: "logistics", title: "Logistics" },
			{ slug: "location", title: "Location" },
		]);
		expect(
			categories.find(({ slug }) => slug === "analytics")?.blocks.map(({ name }) => name)
		).toEqual(["analytics-map", "analytics-card", "uptime-monitor"]);
		expect(
			categories.find(({ slug }) => slug === "logistics")?.blocks.map(({ name }) => name)
		).toEqual(["delivery-tracker", "logistics-network"]);
		expect(categories.flatMap(({ blocks }) => blocks.map(({ name }) => name)).sort()).toEqual(
			getAllBlocks()
				.map(({ name }) => name)
				.sort()
		);
	});
});
