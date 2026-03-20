import { describe, expect, it } from "vitest";
import { getExampleSource, getExampleSources } from "./examples";

describe("examples", () => {
	it("loads and normalizes a single example source", () => {
		const source = getExampleSource("BasicMapExample");

		expect(source).toContain("<Map");
		expect(source).not.toContain("@/registry/map");
	});

	it("loads and normalizes multiple example sources in order", () => {
		const examples = getExampleSources(["BasicMapExample", "MapControlsExample"]);

		expect(examples).toHaveLength(2);
		expect(examples[0]).toMatchObject({ name: "BasicMapExample" });
		expect(examples[1]).toMatchObject({ name: "MapControlsExample" });
		expect(examples.every((example) => example.code.includes("@/registry/map"))).toBe(false);
	});

	it("throws for a missing example file", () => {
		expect(() => getExampleSource("MissingExample")).toThrow(
			"Example file not found: MissingExample"
		);
		expect(() => getExampleSources(["BasicMapExample", "MissingExample"])).toThrow(
			"Example file not found: MissingExample"
		);
	});
});
