import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			alias: { $lib: "src/lib" },
			preprocess: vitePreprocess(),
			inspector: {
				toggleKeyCombo: "meta-shift",
				showToggleButton: "always",
				toggleButtonPos: "bottom-right",
			},
			adapter: adapter({ fallback: "200.html" }),
			prerender: { entries: ["*"], handleMissingId: "warn" },
		}),
	],
	test: {
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "lcov"],
		},
	},
});
