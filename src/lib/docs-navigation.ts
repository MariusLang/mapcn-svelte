import BookOpen from "@lucide/svelte/icons/book-open";
import CornerDownRight from "@lucide/svelte/icons/corner-down-right";
import Layers2 from "@lucide/svelte/icons/layers-2";

export interface NavItem {
	title: string;
	href: string;
	icon: import("svelte").Component;
}

export interface NavGroup {
	title: string;
	items: NavItem[];
}

export const docsNavigation: NavGroup[] = [
	{
		title: "Basics",
		items: [
			{ title: "Getting Started", href: "/docs", icon: BookOpen },
			{ title: "Installation", href: "/docs/installation", icon: BookOpen },
			{ title: "API Reference", href: "/docs/api-reference", icon: BookOpen },
		],
	},
	{
		title: "Components",
		items: [
			{ title: "Map", href: "/docs/basic-map", icon: Layers2 },
			{ title: "Controls", href: "/docs/controls", icon: Layers2 },
			{ title: "Markers", href: "/docs/markers", icon: Layers2 },
			{ title: "Popups", href: "/docs/popups", icon: Layers2 },
			{ title: "Routes", href: "/docs/routes", icon: Layers2 },
			{ title: "Clusters", href: "/docs/clusters", icon: Layers2 },
			{ title: "Advanced", href: "/docs/advanced-usage", icon: Layers2 },
		],
	},
];

export const fullNavItems: NavItem[] = docsNavigation.flatMap((group) => group.items);

export const mainNavItems: NavItem[] = [
	{ title: "Home", href: "/", icon: CornerDownRight },
	{ title: "Docs", href: "/docs", icon: CornerDownRight },
	{ title: "Components", href: "/docs/basic-map", icon: CornerDownRight },
	{ title: "Blocks", href: "/blocks", icon: CornerDownRight },
];

export const siteNavigation: NavGroup[] = [
	{
		title: "Pages",
		items: mainNavItems,
	},
	...docsNavigation,
];

export function findNeighbors(pathName: string): {
	previous: NavItem | null;
	next: NavItem | null;
} {
	const path = pathName.split("?")[0].split("#")[0];
	const index = fullNavItems.findIndex((item) => item.href === path);

	let previous: NavItem | null = null;
	for (let i = index - 1; i >= 0; i--) {
		if (fullNavItems[i].href !== "/llms.txt") {
			previous = fullNavItems[i];
			break;
		}
	}

	let next: NavItem | null = null;
	for (let i = index + 1; i < fullNavItems.length; i++) {
		if (fullNavItems[i].href !== "/llms.txt") {
			next = fullNavItems[i];
			break;
		}
	}

	return { previous, next };
}
