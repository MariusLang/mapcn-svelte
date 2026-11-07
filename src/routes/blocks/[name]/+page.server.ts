import { getAllBlocks, createFileTreeForRegistryItemFiles } from "$lib/blocks.js";
import { getBlockFileSource } from "$lib/get-block-file-source.js";
import { highlightCode } from "$lib/highlight.js";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const entries = () => getAllBlocks().map(({ name }) => ({ name }));

export const load: PageServerLoad = async ({ params }) => {
	const block = getAllBlocks().find(({ name }) => name === params.name);
	if (!block) error(404, "Block not found");
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
};
