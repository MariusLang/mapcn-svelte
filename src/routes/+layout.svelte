<script lang="ts">
	import "../app.css";
	import { TooltipProvider } from "$lib/registry/ui/tooltip/index";
	import { onMount } from "svelte";
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import { inject, pageview } from "@vercel/analytics";

	// The SDK's SvelteKit integration still uses $app/stores, removed in Kit 3.
	onMount(() => {
		inject(
			{
				mode: "production",
				framework: "sveltekit",
				disableAutoTrack: true,
				basePath: import.meta.env.VITE_VERCEL_OBSERVABILITY_BASEPATH,
				beforeSend: (event) => (window.self === window.top ? event : null),
			},
			import.meta.env.VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG
		);
	});
	afterNavigate(() => {
		if (page.route.id) pageview({ route: page.route.id, path: page.url.pathname });
	});

	let { children } = $props();
</script>

<TooltipProvider>
	{@render children()}
</TooltipProvider>
