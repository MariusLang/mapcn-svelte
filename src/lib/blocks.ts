import registry from "../../registry.json";

export interface RegistryBlockItem {
	name: string;
	type: string;
	title?: string;
	description?: string;
	files?: Array<{ path: string; target?: string }>;
	registryDependencies?: string[];
	categories?: string[];
	meta?: { iframeHeight?: string };
}

interface RegistrySchema {
	items: RegistryBlockItem[];
}

export interface FileTree {
	name: string;
	path?: string;
	children?: FileTree[];
}

const typedRegistry = registry as RegistrySchema;
const upstreamBlockOrder = [
	"analytics-map",
	"choropleth",
	"analytics-card",
	"delivery-tracker",
	"uptime-monitor",
	"heatmap",
	"logistics-network",
	"store-locator",
];
const upstreamBlockRank = new Map(upstreamBlockOrder.map((name, index) => [name, index]));

export function getAllBlocks(): RegistryBlockItem[] {
	return typedRegistry.items
		.filter((item) => item.type === "registry:block")
		.toSorted(
			(a, b) =>
				(upstreamBlockRank.get(a.name) ?? Number.POSITIVE_INFINITY) -
				(upstreamBlockRank.get(b.name) ?? Number.POSITIVE_INFINITY)
		)
		.map((item) => ({
			name: item.name,
			type: item.type,
			title: item.title ?? item.name,
			description: item.description,
			files: item.files ?? [],
			registryDependencies: item.registryDependencies ?? [],
			categories: item.categories ?? [],
			meta: item.meta,
		}));
}

export function createFileTreeForRegistryItemFiles(
	files: Array<{ path: string; target?: string }>
): FileTree[] {
	const root: FileTree[] = [];

	for (const file of files) {
		const filePath = file.target ?? file.path;
		const parts = filePath.split("/");
		let currentLevel = root;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const isFile = i === parts.length - 1;
			const existingNode = currentLevel.find((node) => node.name === part);

			if (existingNode) {
				if (!isFile) {
					currentLevel = existingNode.children!;
				}
			} else {
				const newNode: FileTree = isFile
					? { name: part, path: filePath }
					: { name: part, children: [] };
				currentLevel.push(newNode);
				if (!isFile) {
					currentLevel = newNode.children!;
				}
			}
		}
	}

	return root;
}
