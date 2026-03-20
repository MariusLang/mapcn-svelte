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
});
