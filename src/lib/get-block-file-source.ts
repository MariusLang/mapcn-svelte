import { readFileSync } from "fs";
import { join } from "path";

const SRC_DIR = process.cwd();

export function getBlockFileSource(registryPath: string): string {
	const filePath = join(SRC_DIR, registryPath);
	const source = readFileSync(filePath, "utf-8");
	// Rewrite import paths so installed files reference the correct location
	return source.replace(/\$lib\/registry\/blocks\/map/g, "$lib/components/map");
}
