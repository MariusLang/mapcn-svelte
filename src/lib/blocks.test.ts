import { describe, expect, it } from "vitest";
import { createFileTreeForRegistryItemFiles, getAllBlocks } from "./blocks";

describe("getAllBlocks", () => {
	it("returns only registry blocks with normalized defaults", () => {
		const blocks = getAllBlocks();

		expect(blocks.map((block) => block.name)).toEqual([
			"analytics-map",
			"logistics-network",
			"heatmap",
			"delivery-tracker",
		]);
		expect(blocks.every((block) => block.type === "registry:block")).toBe(true);

		expect(blocks[0]).toMatchObject({
			title: "Analytics Map",
			categories: ["analytics", "dashboard"],
			meta: { iframeHeight: "970px" },
		});
		expect(blocks[0].registryDependencies).toContain("card");
		expect(blocks[0].registryDependencies).toContain("chart");
		expect(blocks[0].registryDependencies?.some((d) => d.endsWith("/r/map.json"))).toBe(true);

		expect(blocks[2]).toMatchObject({
			title: "Heatmap",
			files: [
				{ path: "src/lib/registry/blocks/heatmap/Page.svelte", target: "heatmap/+page.svelte" },
			],
			categories: ["visualization", "heatmap"],
		});
		expect(blocks[2].registryDependencies).toContain("card");
		expect(blocks[2].registryDependencies?.some((d) => d.endsWith("/r/map.json"))).toBe(true);
		expect(blocks[2].meta).toBeUndefined();
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
