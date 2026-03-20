import { describe, expect, it } from "vitest";
import { resolveMapTheme } from "./theme";

describe("resolveMapTheme", () => {
	it("prefers the explicit theme prop over the ambient theme", () => {
		expect(resolveMapTheme({ explicitTheme: "dark", ambientTheme: "light" })).toBe("dark");
	});

	it("falls back to the ambient theme when no explicit theme is provided", () => {
		expect(resolveMapTheme({ ambientTheme: "light" })).toBe("light");
	});
});
