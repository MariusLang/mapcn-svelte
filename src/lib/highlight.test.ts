import { beforeEach, describe, expect, it, vi } from "vitest";

const codeToHtml = vi.fn();
const getSingletonHighlighter = vi.fn(async () => ({ codeToHtml }));

vi.mock("shiki", () => ({
	getSingletonHighlighter,
}));

describe("highlightCode", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("creates a highlighter once and uses the default svelte language", async () => {
		vi.resetModules();
		codeToHtml.mockReturnValue("<pre>first</pre>");

		const { highlightCode } = await import("./highlight");

		await expect(highlightCode("<script />")).resolves.toBe("<pre>first</pre>");
		expect(getSingletonHighlighter).toHaveBeenCalledTimes(1);
		expect(getSingletonHighlighter).toHaveBeenCalledWith({
			themes: ["github-dark", "github-light"],
			langs: ["ts", "tsx", "js", "jsx", "json", "bash", "css", "html", "md", "svelte"],
		});
		expect(codeToHtml).toHaveBeenCalledWith("<script />", {
			lang: "svelte",
			themes: {
				light: "github-light",
				dark: "github-dark",
			},
			defaultColor: false,
		});
	});

	it("reuses the cached highlighter and forwards explicit languages", async () => {
		vi.resetModules();
		codeToHtml.mockResolvedValue("<pre>shared</pre>");

		const { highlightCode } = await import("./highlight");

		await highlightCode("const value = 1;", "ts");
		await highlightCode("console.log(value)", "js");

		expect(getSingletonHighlighter).toHaveBeenCalledTimes(2);
		expect(codeToHtml).toHaveBeenNthCalledWith(1, "const value = 1;", {
			lang: "ts",
			themes: {
				light: "github-light",
				dark: "github-dark",
			},
			defaultColor: false,
		});
		expect(codeToHtml).toHaveBeenNthCalledWith(2, "console.log(value)", {
			lang: "js",
			themes: {
				light: "github-light",
				dark: "github-dark",
			},
			defaultColor: false,
		});
	});
});
