/* eslint-disable @typescript-eslint/no-require-imports */
const Module = require("node:module");
const path = require("node:path");

const legacyTypeScriptRoot = path.dirname(require.resolve("typescript-svelte-check/package.json"));
const load = Module._load;

Module._load = function loadWithLegacyTypeScript(request, parent, isMain) {
	if (request === "typescript" || request.startsWith("typescript/")) {
		const subpath = request.slice("typescript".length);
		return load(
			subpath
				? path.join(legacyTypeScriptRoot, subpath)
				: path.join(legacyTypeScriptRoot, "lib/typescript.js"),
			parent,
			isMain
		);
	}

	return load.apply(this, arguments);
};
