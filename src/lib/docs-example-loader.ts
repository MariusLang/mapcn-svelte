import { getExampleSource } from "$lib/examples";
import { highlightCode } from "$lib/highlight";

type ExampleSourceGetter = (name: string) => string;
type Highlighter = (code: string, language: string) => Promise<string>;

export function createHighlightedExampleLoader({
	getExampleSource,
	highlightCode,
}: {
	getExampleSource: ExampleSourceGetter;
	highlightCode: Highlighter;
}) {
	const single = async (name: string) => {
		const source = getExampleSource(name);

		return {
			source,
			highlighted: await highlightCode(source, "svelte"),
		};
	};

	return {
		single,
		async namedFiles(names: string[]) {
			return Promise.all(
				names.map(async (name) => {
					const { source, highlighted } = await single(name);

					return {
						name: `${name}.svelte`,
						code: source,
						highlightedCode: highlighted,
					};
				})
			);
		},
	};
}

export const docsExampleLoader = createHighlightedExampleLoader({
	getExampleSource,
	highlightCode,
});
