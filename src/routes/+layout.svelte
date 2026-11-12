<script lang="ts">
	import "../app.css";
	import { TooltipProvider } from "$lib/registry/ui/tooltip/index";
	import { onMount } from "svelte";
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import { fullNavItems } from "$lib/docs-navigation";
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

	const siteUrl = import.meta.env.PUBLIC_SITE_URL || "https://mapcn-svelte.dev";
	const siteTitle = "mapcn-svelte - Beautiful maps made simple";
	const siteDescription =
		"Ready-to-use, customizable map components for Svelte. Built on MapLibre and styled with Tailwind.";
	const canonical = $derived(new URL(page.url.pathname, siteUrl).href);
	const block = $derived(page.data.block as { title?: string; description?: string } | undefined);
	const pageTitle = $derived(
		block?.title ??
			fullNavItems.find((item) => item.href === page.url.pathname)?.title ??
			(page.url.pathname === "/blocks" ? "Map Blocks" : undefined)
	);
	const socialTitle = $derived(pageTitle ? `${pageTitle} - mapcn-svelte` : siteTitle);
	const description = $derived(block?.description ?? siteDescription);
	const banner = new URL("/banner.png", siteUrl).href;

	let { children } = $props();
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	{#if !block && page.url.pathname !== "/blocks" && page.url.pathname !== "/docs/skill"}
		<meta name="description" content={siteDescription} />
	{/if}
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="mapcn-svelte" />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={socialTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={banner} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={siteTitle} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={socialTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={banner} />
</svelte:head>

<TooltipProvider>
	{@render children()}
</TooltipProvider>
