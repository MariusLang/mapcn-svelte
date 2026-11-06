<script lang="ts">
	import { SvelteSet } from "svelte/reactivity";
	import {
		Inset as SidebarInset,
		Provider as SidebarProvider,
	} from "$lib/registry/ui/sidebar/index.js";
	import FilterSidebar from "./FilterSidebar.svelte";
	import NetworkMap from "./NetworkMap.svelte";
	import { hubs, routes, type Filter } from "./data.js";

	const hidden = new SvelteSet<Filter>();
	const visibleHubs = $derived(hubs.filter((hub) => !hidden.has(hub.region)));
	const visibleRoutes = $derived.by(() => {
		const ids = new Set(visibleHubs.map((hub) => hub.id));
		return routes.filter(
			(route) =>
				!hidden.has(route.mode) &&
				!hidden.has(route.status) &&
				ids.has(route.from) &&
				ids.has(route.to)
		);
	});

	function toggle(filter: Filter) {
		if (!hidden.delete(filter)) hidden.add(filter);
	}
</script>

<SidebarProvider>
	<FilterSidebar {hubs} {routes} {visibleRoutes} {hidden} ontoggle={toggle} />
	<SidebarInset>
		<NetworkMap hubs={visibleHubs} routes={visibleRoutes} />
	</SidebarInset>
</SidebarProvider>
