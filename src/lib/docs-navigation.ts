import Map from "@lucide/svelte/icons/map";
import BookOpen from "@lucide/svelte/icons/book-open";
import Code from "@lucide/svelte/icons/code";
import Braces from "@lucide/svelte/icons/braces";
import MapPin from "@lucide/svelte/icons/map-pin";
import MessageSquare from "@lucide/svelte/icons/message-square";
import Route from "@lucide/svelte/icons/route";
import Settings from "@lucide/svelte/icons/settings";
import Layers from "@lucide/svelte/icons/layers";
import Wrench from "@lucide/svelte/icons/wrench";

export interface NavItem {
	title: string;
	href: string;
	icon: any;
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
			{ title: "Installation", href: "/docs/installation", icon: Code },
			{ title: "API Reference", href: "/docs/api-reference", icon: Braces },
		],
	},
	{
		title: "Components",
		items: [
			{ title: "Map", href: "/docs/basic-map", icon: Map },
			{ title: "Controls", href: "/docs/controls", icon: Settings },
			{ title: "Markers", href: "/docs/markers", icon: MapPin },
			{ title: "Popups", href: "/docs/popups", icon: MessageSquare },
			{ title: "Routes", href: "/docs/routes", icon: Route },
			{ title: "Clusters", href: "/docs/clusters", icon: Layers },
			{ title: "Advanced", href: "/docs/advanced-usage", icon: Wrench },
		],
	},
];
