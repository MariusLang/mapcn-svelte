import { describe, expect, it } from "vitest";
import {
	createLlmIndexMarkdown,
	createLlmItemMarkdown,
	getRegistryItem,
	getRegistryItemNames,
} from "./llm-content";

describe("llm content", () => {
	it("generates an index with Svelte install guidance and registry links", () => {
		const markdown = createLlmIndexMarkdown();

		expect(markdown).toContain("# mapcn-svelte");
		expect(markdown).toContain("https://mapcn-svelte.dev/r/registry.json");
		expect(markdown).toContain("npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/map.json");
		expect(markdown).toContain('import { Map, MapControls } from "$lib/components/ui/map";');
		expect(markdown).toContain("- [Analytics Map](/llm/analytics-map)");
	});

	it("generates item pages for every registry entry", () => {
		for (const name of getRegistryItemNames()) {
			const item = getRegistryItem(name);

			expect(item, name).toBeDefined();
			expect(createLlmItemMarkdown(item!)).toContain(
				`Registry item: https://mapcn-svelte.dev/r/${name}.json`
			);
		}
	});

	it("uses the base install command for the map item and item urls for blocks", () => {
		const map = getRegistryItem("map");
		const analytics = getRegistryItem("analytics-map");

		expect(map).toBeDefined();
		expect(analytics).toBeDefined();
		expect(createLlmItemMarkdown(map!)).toContain(
			"npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/map.json"
		);
		expect(createLlmItemMarkdown(analytics!)).toContain(
			"npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/analytics-map.json"
		);
	});
});
