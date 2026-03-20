import { getAllBlocks, createFileTreeForRegistryItemFiles } from "$lib/blocks.js";
import { getBlockFileSource } from "$lib/get-block-file-source.js";
import { highlightCode } from "$lib/highlight.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const blocks = getAllBlocks();

	const blocksWithData = await Promise.all(
		blocks.map(async (block) => {
			const tree = createFileTreeForRegistryItemFiles(block.files ?? []);

			const highlightedFiles = await Promise.all(
				(block.files ?? []).map(async (file) => {
					const content = getBlockFileSource(file.path);
					const lang = file.path.split(".").pop() ?? "svelte";
					const highlightedContent = await highlightCode(content, lang);
					return {
						path: file.path,
						target: file.target ?? file.path,
						content,
						highlightedContent,
					};
				})
			);

			return { block, tree, highlightedFiles };
		})
	);

	return { blocksWithData };
};
