import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import registry from "../../registry.json";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

type RegistryFile = { path: string; type: string; target: string };
type RegistryItem = {
	name: string;
	type: string;
	title: string;
	description: string;
	files: RegistryFile[];
	registryDependencies?: string[];
};

const items = registry.items as RegistryItem[];

describe("registry.json", () => {
	it("has the expected top-level shape", () => {
		expect(registry.name).toBeTypeOf("string");
		expect(registry.homepage).toBeTypeOf("string");
		expect(Array.isArray(registry.items)).toBe(true);
		expect(registry.items.length).toBeGreaterThan(0);
	});

	it("has unique item names", () => {
		const names = items.map((item) => item.name);
		expect(new Set(names).size).toBe(names.length);
	});

	describe.each(items)("item: $name", (item) => {
		it("has the required metadata fields", () => {
			expect(item.name, "name").toBeTruthy();
			expect(item.type, "type").toMatch(/^registry:/);
			expect(item.title, "title").toBeTruthy();
			expect(item.description, "description").toBeTruthy();
			expect(item.files.length, "files").toBeGreaterThan(0);
		});

		it("has well-formed file entries", () => {
			for (const file of item.files) {
				expect(file.path, "path").toBeTypeOf("string");
				expect(file.type, "type").toMatch(/^registry:/);
				expect(file.target, "target").toBeTypeOf("string");
			}
		});

		it("has unique file paths and targets", () => {
			const paths = item.files.map((file) => file.path);
			const targets = item.files.map((file) => file.target);
			expect(new Set(paths).size, "duplicate path").toBe(paths.length);
			expect(new Set(targets).size, "duplicate target").toBe(targets.length);
		});

		it("references files that exist on disk", () => {
			for (const file of item.files) {
				expect(existsSync(path.join(repoRoot, file.path)), `missing on disk: ${file.path}`).toBe(
					true
				);
			}
		});

		// Generalizes issue #17: any sibling file a registered file imports must
		// itself be registered, otherwise a fresh install resolves a dangling import.
		it("registers every local file its sources import", () => {
			const registeredAbsPaths = collectRegisteredPaths(item);

			for (const file of item.files) {
				const absPath = path.join(repoRoot, file.path);
				if (!existsSync(absPath)) continue;

				const source = readFileSync(absPath, "utf8");
				const fileDir = path.dirname(absPath);

				for (const spec of importSpecifiers(source)) {
					const resolved = resolveLocalImport(fileDir, spec);
					if (!resolved) continue; // import target not found on disk -> not a registry concern here

					expect(
						registeredAbsPaths.has(resolved),
						`${file.path} imports "${spec}" but ${path.relative(repoRoot, resolved)} is not registered in registry.json`
					).toBe(true);
				}
			}
		});
	});
});

/** Collect every import/export specifier used in `from "./x"` / `from "$lib/x"`. */
function importSpecifiers(source: string): string[] {
	const specs = new Set<string>();
	const re = /\bfrom\s+["']((?:\.\.?\/|\$lib\/)[^"']+)["']/g;
	let match: RegExpExecArray | null;
	while ((match = re.exec(source)) !== null) {
		specs.add(match[1]);
	}
	return [...specs];
}

function collectRegisteredPaths(item: RegistryItem): Set<string> {
	const paths = new Set(item.files.map((file) => path.resolve(repoRoot, file.path)));

	for (const dependency of item.registryDependencies ?? []) {
		if (!dependency.endsWith("/r/map.json")) continue;
		const mapItem = items.find((entry) => entry.name === "map");
		for (const file of mapItem?.files ?? []) {
			paths.add(path.resolve(repoRoot, file.path));
		}
	}

	return paths;
}

/** Resolve a relative import to an existing on-disk file, mirroring TS/Svelte resolution. */
function resolveLocalImport(fromDir: string, spec: string): string | null {
	if (spec.startsWith("$lib/registry/ui/")) return null;
	if (spec === "$lib/utils.js" || spec === "$lib/utils") return null;

	const registrySpec = spec.replace("$lib/components/ui/map", "$lib/registry/blocks/map");
	const base = spec.startsWith("$lib/")
		? path.resolve(repoRoot, "src/lib", registrySpec.slice("$lib/".length))
		: path.resolve(fromDir, registrySpec);
	const candidates: string[] = [];

	if (spec.endsWith(".svelte") || spec.endsWith(".ts")) {
		candidates.push(base);
	} else if (spec.endsWith(".js")) {
		// TS convention: import "./data.js" resolves to data.ts
		candidates.push(base.replace(/\.js$/, ".ts"), base);
	} else {
		candidates.push(`${base}.ts`, `${base}.svelte`, `${base}.js`, path.join(base, "index.ts"));
	}

	return candidates.find((candidate) => existsSync(candidate)) ?? null;
}
