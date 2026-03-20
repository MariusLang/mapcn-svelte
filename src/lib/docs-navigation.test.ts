import { describe, expect, it } from "vitest";
import {
	docsNavigation,
	findNeighbors,
	fullNavItems,
	mainNavItems,
	siteNavigation,
} from "./docs-navigation";

describe("docs navigation", () => {
	it("flattens documentation groups into a linear nav list", () => {
		const itemCount = docsNavigation.reduce((count, group) => count + group.items.length, 0);

		expect(fullNavItems).toHaveLength(itemCount);
		expect(fullNavItems[0].href).toBe("/docs");
		expect(fullNavItems.at(-1)?.href).toBe("/docs/advanced-usage");
	});

	it("includes the main site pages before the docs groups", () => {
		expect(siteNavigation[0]).toEqual({
			title: "Pages",
			items: mainNavItems,
		});
		expect(siteNavigation.slice(1)).toEqual(docsNavigation);
	});

	it("finds adjacent docs pages after stripping query strings and hashes", () => {
		expect(findNeighbors("/docs/installation?tab=cli#usage")).toEqual({
			previous: fullNavItems[0],
			next: fullNavItems[2],
		});
	});

	it("returns null for missing neighbors at the ends of the docs list", () => {
		expect(findNeighbors("/docs")).toEqual({
			previous: null,
			next: fullNavItems[1],
		});
		expect(findNeighbors("/docs/advanced-usage")).toEqual({
			previous: fullNavItems.at(-2) ?? null,
			next: null,
		});
	});
});
