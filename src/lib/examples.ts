/**
 * Bundle all example components as raw strings at build time.
 */
const examples = import.meta.glob("$lib/components/docs/preview/examples/*.svelte", {
	query: "?raw",
	import: "default",
	eager: true,
});

function normalizeImports(source: string) {
	return source.replace(/@\/registry\/map/g, "@/components/ui/map");
}

export function getExampleSource(name: string): string {
	const key = `/src/lib/components/docs/preview/examples/${name}.svelte`;
	const loader = examples[key];

	if (!loader) {
		throw new Error(`Example file not found: ${name}`);
	}

	return normalizeImports(loader as string);
}

export function getExampleSources(names: string[]): Array<{ name: string; code: string }> {
	return names.map((name) => {
		const key = `/src/lib/components/docs/preview/examples/${name}.svelte`;
		const loader = examples[key];

		if (!loader) {
			throw new Error(`Example file not found: ${name}`);
		}

		return {
			name,
			code: normalizeImports(loader as string),
		};
	});
}
