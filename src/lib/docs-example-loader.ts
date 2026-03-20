type ExampleSourceGetter = (name: string) => string;
type Highlighter = (code: string, language: string) => Promise<string>;

export function createHighlightedExampleLoader({
	getExampleSource,
	highlightCode,
}: {
	getExampleSource: ExampleSourceGetter;
	highlightCode: Highlighter;
}) {
	return {
		async single(name: string) {
			const source = getExampleSource(name);

			return {
				source,
				highlighted: await highlightCode(source, "svelte"),
			};
		},
	};
}
