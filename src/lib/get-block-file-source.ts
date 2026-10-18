import { readFileSync } from "fs";
import { join, relative } from "path";

const SRC_DIR = join(process.cwd(), "src");

export function getBlockFileSource(registryPath: string): string {
	const filePath = join(SRC_DIR, relative("src", registryPath));
	const source = readFileSync(filePath, "utf-8");
	// Rewrite import paths so installed files reference the correct location
	return source.replace(/\$lib\/registry\/(?:blocks|ui)\/map/g, "$lib/components/ui/map");
}
