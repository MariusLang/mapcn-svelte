import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import registry from "../registry.json" with { type: "json" };
import {
	createBasemapMarkdown,
	getItemInstallCommand,
	siteUrl as site,
} from "../src/lib/llm-content.ts";
import { mapInstallCommand } from "../src/lib/llm-prompts.ts";

const skillDir = "skills/mapcn-svelte";
const exampleDir = "src/lib/components/docs/preview/examples";
const sourceUrl = "https://github.com/MariusLang/mapcn-svelte/blob/main";
const check = process.argv.includes("--check");

const groups = [
	[
		"Map",
		"basic-map",
		{
			Map: "The map container. Set its parent height, choose styles or a projection, and pass MapLibre constructor settings through `options`.",
			MapViewport: "Type for longitude/latitude center, zoom, bearing, and pitch.",
			useMap: "Reads the reactive map, style readiness, and theme from a child component.",
		},
	],
	[
		"Controls",
		"controls",
		{
			MapControls:
				"Zoom, compass, locate, and fullscreen controls. Use the `show*` props and `position` to configure them.",
		},
	],
	[
		"Markers",
		"markers",
		{
			MapMarker: "DOM marker at `longitude` and `latitude`. Supports dragging and mouse events.",
			MarkerContent: "Renders custom content inside a marker.",
			MarkerPopup: "Opens a popup on marker click.",
			MarkerTooltip: "Shows a tooltip on marker hover.",
			MarkerLabel: "Adds a label above or below the marker.",
		},
	],
	[
		"Popups",
		"popups",
		{
			MapPopup:
				"Standalone popup at a coordinate. Render it conditionally and clear the selection in `onclose`.",
		},
	],
	[
		"Routes",
		"routes",
		{
			MapRoute:
				"Draws a line from `coordinates` and accepts a `progress` fraction. Fetch directions outside it.",
			RouteProgress: "Styles the traveled part of the parent route.",
			RouteMarker:
				"Positions a marker at the start, end, current progress, or a numeric fraction of the parent route.",
			RouteAnchor: "Type for the positions accepted by `RouteMarker`.",
		},
	],
	[
		"Arcs",
		"arcs",
		{
			MapArc: "Draws arcs between coordinate pairs and supports hover and click events.",
			MapArcDatum: "Type for an arc datum.",
			MapArcEvent: "Type for an arc interaction event.",
			MapArcProps: "Props accepted by `MapArc`.",
		},
	],
	[
		"GeoJSON",
		"geojson",
		{
			MapGeoJSON:
				"Draws fill and outline layers from a GeoJSON object or URL. Use expressions for data-driven paint.",
			MapGeoJSONEvent: "Type for a GeoJSON feature interaction event.",
			MapGeoJSONProps: "Props accepted by `MapGeoJSON`.",
		},
	],
	[
		"Clusters",
		"clusters",
		{
			MapClusterLayer:
				"Clusters GeoJSON points in MapLibre and supports point and cluster click handlers.",
		},
	],
] as const;

const code = (value: string) => `\`${value}\``;
const read = (path: string) => readFileSync(path, "utf8");

function write(path: string, content: string) {
	if (!check) {
		writeFileSync(path, content);
	} else if (read(path) !== content) {
		throw new Error(`${path} is out of date. Run pnpm build:skill.`);
	}
}

function fillSection(source: string, name: string, content: string) {
	const pattern = new RegExp(`(<!-- generated:${name} -->)[\\s\\S]*?(<!-- /generated:${name} -->)`);
	if (!pattern.test(source)) throw new Error(`Missing generated section: ${name}`);
	return source.replace(pattern, (_, start, end) => `${start}\n\n${content.trim()}\n\n${end}`);
}

function exampleLinks(slug: string) {
	const page = read(`src/routes/docs/${slug}/+page.svelte`);
	const examples = [
		...page.matchAll(/from "\$lib\/components\/docs\/preview\/examples\/([^"]+\.svelte)"/g),
	].map(([, file]) => {
		read(`${exampleDir}/${file}`);
		return `- [${file}](${sourceUrl}/${exampleDir}/${file})`;
	});
	return examples.length ? ["", "Example source:", "", ...examples] : [];
}

const barrel = read("src/lib/registry/blocks/map/index.ts");
const exports = [...barrel.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)].flatMap(([, list]) =>
	list.split(",").map((name) =>
		name
			.trim()
			.split(/\s+as\s+/)
			.at(-1)!
	)
);
const documented = groups.flatMap(([, , entries]) => Object.keys(entries));
const mismatch = exports
	.filter((name) => !documented.includes(name))
	.concat(documented.filter((name) => !exports.includes(name)));
if (mismatch.length)
	throw new Error(`Map exports and skill reference differ: ${mismatch.join(", ")}`);

const skillPath = join(skillDir, "SKILL.md");
let skill = fillSection(read(skillPath), "basemap", createBasemapMarkdown());
skill = fillSection(
	skill,
	"components",
	groups
		.map(([title, , entries]) => `- **${title}** — ${Object.keys(entries).map(code).join(", ")}`)
		.join("\n")
);
write(skillPath, skill);

const components = groups.flatMap(([title, slug, entries]) => [
	`## ${title}`,
	"",
	`[Documentation](${site}/docs/${slug})`,
	"",
	...Object.entries(entries).map(([name, description]) => `- ${code(name)} — ${description}`),
	...exampleLinks(slug),
	"",
]);
write(
	join(skillDir, "references/components.md"),
	[
		"# Components",
		"",
		`Install with ${code(mapInstallCommand)}. Import the exports from the ${code("map")} directory under the project's configured UI alias, usually ${code("$lib/components/ui/map")}. Read the installed components for their full prop types.`,
		"",
		"Examples use this repository’s aliases. Adjust them to match your project, and copy any companion files listed in the docs demo.",
		"",
		...components,
		"## Advanced",
		"",
		`[Documentation](${site}/docs/advanced-usage)`,
		...exampleLinks("advanced-usage"),
		"",
	].join("\n")
);

const blocks = registry.items
	.filter((item) => item.type === "registry:block")
	.flatMap((block) => {
		const targets = block.files.map((file) => code(file.target ?? file.path));
		const dependencies = block.registryDependencies.map(code);
		return [
			`## ${block.title}`,
			"",
			block.description,
			"",
			"\`\`\`sh",
			getItemInstallCommand(block),
			"\`\`\`",
			"",
			`- Registry file targets — ${targets.join(", ")}`,
			`- Registry dependencies — ${dependencies.join(", ")}`,
			`- [Preview and source](${site}/blocks/${block.name})`,
			"",
		];
	});
write(
	join(skillDir, "references/blocks.md"),
	[
		"# Blocks",
		"",
		"Blocks are complete Svelte pages with sample data. Replace the sample data with the application’s data and keep the block’s relative imports intact.",
		"",
		"## Routes and file placement",
		"",
		"- In SvelteKit, place the block under the configured routes directory, usually `src/routes`. Keep `+page.svelte` and its companion files together. Check for an existing route before installing.",
		"- In standalone Svelte or Vite, move the page and its companion files to the appropriate feature directory, rename `+page.svelte` to a regular component such as `StoreLocator.svelte`, and mount it or register it with the app’s router.",
		"- The lists below show registry targets. A target starting with `~/` is relative to the project root. Shared library files resolve under the configured library alias, and imports of the map resolve through the UI alias. Confirm the resolved paths in the CLI output.",
		"",
		...blocks,
	].join("\n")
);
