<script lang="ts">
	import { SidebarProvider } from "$lib/registry/ui/sidebar/index";
	import Header from "$lib/components/Header.svelte";
	import DocSidebar from "$lib/components/docs/DocSidebar.svelte";

	let { children } = $props();
</script>

<SidebarProvider class="min-h-min" style="--sidebar-width: 13rem; --sidebar-width-mobile: 24rem;">
	<div class="flex min-h-screen w-full flex-col">
		<Header />
		<div class="flex flex-1">
			<DocSidebar />
			<main class="w-full flex-1 px-6 lg:me-6">
				{@render children()}
			</main>
		</div>
	</div>
</SidebarProvider>
