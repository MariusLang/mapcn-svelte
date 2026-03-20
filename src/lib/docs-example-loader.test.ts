import { describe, expect, it, vi } from "vitest";
import { createHighlightedExampleLoader } from "./docs-example-loader";

describe("createHighlightedExampleLoader", () => {
	it("returns highlighted data for a single example", async () => {
		const load = createHighlightedExampleLoader({
			getExampleSource: (name) => `${name}-source`,
			highlightCode: vi.fn(async (code: string) => `<pre>${code}</pre>`),
		});

		await expect(load.single("BasicMapExample")).resolves.toEqual({
			source: "BasicMapExample-source",
			highlighted: "<pre>BasicMapExample-source</pre>",
		});
	});

	it("returns named files for multi-file examples", async () => {
		const load = createHighlightedExampleLoader({
			getExampleSource: (name) => `${name}-source`,
			highlightCode: vi.fn(async (code: string) => `<pre>${code}</pre>`),
		});

		await expect(load.namedFiles(["AdvancedUsageExample", "MapController"])).resolves.toEqual([
			{
				name: "AdvancedUsageExample.svelte",
				code: "AdvancedUsageExample-source",
				highlightedCode: "<pre>AdvancedUsageExample-source</pre>",
			},
			{
				name: "MapController.svelte",
				code: "MapController-source",
				highlightedCode: "<pre>MapController-source</pre>",
			},
		]);
	});

	it("surfaces missing example errors from the source getter", async () => {
		const load = createHighlightedExampleLoader({
			getExampleSource: (name) => {
				throw new Error(`missing ${name}`);
			},
			highlightCode: vi.fn(async (code: string) => `<pre>${code}</pre>`),
		});

		await expect(load.single("MissingExample")).rejects.toThrow("missing MissingExample");
	});
});
