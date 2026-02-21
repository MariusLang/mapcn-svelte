<script lang="ts">
	import { SidebarInset, SidebarProvider } from "$lib/registry/ui/sidebar/index";
	import DocSidebar from "$lib/components/docs/DocSidebar.svelte";
	import DocsHeader from "$lib/components/docs/DocsHeader.svelte";

	let { children } = $props();
</script>

<SidebarProvider>
	<DocSidebar />
	<SidebarInset>
		<DocsHeader />
		<main class="container">
			{@render children()}
		</main>
	</SidebarInset>
</SidebarProvider>
