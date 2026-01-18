<script lang="ts">
	import "../app.css";
	import Footer from "$lib/components/Footer.svelte";
	import { TooltipProvider } from "$lib/registry/ui/tooltip/index";
	import { injectAnalytics } from "@vercel/analytics/sveltekit";

	injectAnalytics({ mode: "production" });

	let { children } = $props();
</script>

<TooltipProvider>
	{@render children()}
</TooltipProvider>
<Footer />
