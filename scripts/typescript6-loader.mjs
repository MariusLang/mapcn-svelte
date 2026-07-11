import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const legacyTypeScript = pathToFileURL(require.resolve("typescript-svelte-check")).href;

export function resolve(specifier, context, nextResolve) {
	if (specifier === "typescript") {
		return { shortCircuit: true, url: legacyTypeScript };
	}

	return nextResolve(specifier, context);
}
