<script lang="ts">
	import { SidebarProvider } from "$lib/registry/ui/sidebar/index";
	import Header from "$lib/components/Header.svelte";
	import MobileSidebarTrigger from "$lib/components/MobileSidebarTrigger.svelte";
	import DocSidebar from "$lib/components/docs/DocSidebar.svelte";

	let { children } = $props();
</script>

<SidebarProvider>
	<div class="flex min-h-screen w-full flex-col">
		<Header
			class="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b backdrop-blur"
		>
			<MobileSidebarTrigger />
		</Header>

		<div class="felx flex-1">
			<DocSidebar />
			<main class="lex-1 mx-auto w-full max-w-3xl px-6 py-12">
				{@render children()}
			</main>
		</div>
	</div>
</SidebarProvider>
