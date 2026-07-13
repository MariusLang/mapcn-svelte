import { createLlmIndexMarkdown } from "$lib/llm-content";

export const prerender = true;

export function GET() {
	return new Response(createLlmIndexMarkdown(), {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
		},
	});
}
