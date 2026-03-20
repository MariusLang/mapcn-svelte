<script lang="ts">
	import { Provider as SidebarProvider } from "$lib/registry/ui/sidebar/index.js";
	import FilterSidebar from "./FilterSidebar.svelte";
	import NetworkMap from "./NetworkMap.svelte";
	import { hubs, routes } from "./data.js";
</script>

<div class="bg-background h-screen overflow-hidden">
	<SidebarProvider>
		<FilterSidebar {hubs} {routes} />
		<div class="relative flex-1 overflow-hidden">
			<NetworkMap {hubs} {routes} />
		</div>
	</SidebarProvider>
</div>
