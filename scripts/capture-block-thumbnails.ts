import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import registry from "../registry.json" with { type: "json" };

const baseUrl = process.env.BASE_URL ?? "http://localhost:62726";
const outDir = path.join(process.cwd(), "static", "blocks");
const only = process.argv.slice(2);
const blocks = registry.items
	.filter((item) => item.type === "registry:block")
	.map((item) => item.name)
	.filter((name) => only.length === 0 || only.includes(name));

async function main() {
	await mkdir(outDir, { recursive: true });
	const browser = await chromium.launch();
	try {
		for (const scheme of ["light", "dark"] as const) {
			const context = await browser.newContext({
				viewport: { width: 1280, height: 800 },
				colorScheme: scheme,
			});
			await context.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
			try {
				const page = await context.newPage();
				for (const name of blocks) {
					await page.goto(`${baseUrl}/view/${name}`, { waitUntil: "load" });
					await page.addStyleTag({
						content:
							"#svelte-inspector-host, #svelte-inspector-toggle { display: none !important; }",
					});
					await page.waitForSelector(".maplibregl-canvas", { timeout: 15_000 });
					await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
					await page.waitForTimeout(1_500);
					const file = path.join(outDir, `${name}-${scheme}.jpg`);
					await page.screenshot({ path: file, type: "jpeg", quality: 85 });
					console.log(`✓ ${path.relative(process.cwd(), file)}`);
				}
			} finally {
				await context.close();
			}
		}
	} finally {
		await browser.close();
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
