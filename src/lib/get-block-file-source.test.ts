import { describe, expect, it } from "vitest";
import { getBlockFileSource } from "./get-block-file-source";

describe("getBlockFileSource", () => {
	it("rewrites registry map imports to installed component imports", () => {
		const source = getBlockFileSource("src/lib/registry/blocks/analytics-map/Page.svelte");

		expect(source).toContain('import Map from "$lib/components/map/Map.svelte";');
		expect(source).not.toContain("$lib/registry/blocks/map");
	});

	it("leaves unrelated imports untouched", () => {
		const source = getBlockFileSource("src/lib/registry/blocks/map/index.ts");

		expect(source).toContain('export { default as Map } from "./Map.svelte";');
		expect(source).not.toContain("$lib/components/map");
	});

	it("surfaces filesystem errors for missing files", () => {
		expect(() => getBlockFileSource("src/lib/registry/blocks/missing/File.svelte")).toThrow(
			"ENOENT"
		);
	});
});
