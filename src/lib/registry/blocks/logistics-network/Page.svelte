<script lang="ts">
	import {
		Inset as SidebarInset,
		Provider as SidebarProvider,
	} from "$lib/registry/ui/sidebar/index.js";
	import FilterSidebar from "./FilterSidebar.svelte";
	import NetworkMap from "./NetworkMap.svelte";
	import { hubs, routes } from "./data.js";
</script>

<SidebarProvider>
	<FilterSidebar {hubs} {routes} />
	<SidebarInset>
		<NetworkMap {hubs} {routes} />
	</SidebarInset>
</SidebarProvider>
