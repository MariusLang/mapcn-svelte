import { error } from "@sveltejs/kit";
import { createLlmItemMarkdown, getRegistryItem, getRegistryItemNames } from "$lib/llm-content";

export const prerender = true;

export function entries() {
	return getRegistryItemNames().map((name) => ({ name }));
}

export function GET({ params }: { params: { name: string } }) {
	const item = getRegistryItem(params.name);

	if (!item) {
		error(404, "Not found");
	}

	return new Response(createLlmItemMarkdown(item), {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
		},
	});
}
