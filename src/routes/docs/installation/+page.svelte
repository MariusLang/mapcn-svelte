<script lang="ts">
	import { CodeBlock } from "$lib/components/docs/preview";
	import { Card } from "$lib/registry/ui/card";
	import { Map, MapControls } from "$lib/components/ui/map";
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsLink from "$lib/components/docs/DocsLink.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import DocsNote from "$lib/components/docs/DocsNote.svelte";

	const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? "https://mapcn-svelte.dev";

	const installCode = `npx shadcn-svelte@latest add ${siteUrl}/r/map.json`;

	const usageCode =
		`<scr` +
		`ipt lang="ts">
  import { Map, MapControls } from "$lib/components/ui/map";
  import { Card } from "$lib/components/ui/card";
</scr` +
		`ipt>

<Card class="h-[320px] overflow-hidden p-0">
  <Map center={[-74.006, 40.7128]} zoom={11}>
    <MapControls />
  </Map>
</Card>`;
</script>

<svelte:head>
	<title>Installation - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	title="Installation"
	description="How to install and set up mapcn in your project."
	pathname="/docs/installation"
>
	<DocsSection title="Prerequisites">
		<p>
			A project with
			<DocsLink href="https://tailwindcss.com" external>Tailwind CSS</DocsLink>
			and
			<DocsLink href="https://www.shadcn-svelte.com" external>shadcn-svelte</DocsLink>
			set up.
		</p>
	</DocsSection>

	<DocsSection title="Installation">
		<p>Run the following command to add the map component:</p>

		<CodeBlock code={installCode} language="bash" />

		<p>
			This will install
			<DocsCode>maplibre-gl</DocsCode>
			and add the map component to your project.
		</p>
	</DocsSection>

	<DocsSection title="Usage">
		<p>Import and use the map component:</p>

		<CodeBlock code={usageCode} />

		<Card class="h-[320px] overflow-hidden rounded-lg p-0">
			<Map center={[-74.006, 40.7128]} zoom={11}>
				<MapControls />
			</Map>
		</Card>
	</DocsSection>

	<DocsNote>
		<strong>Note:</strong> The map uses free CARTO basemap tiles by default. No API key required. Tiles
		automatically switch between light and dark themes.
	</DocsNote>
</DocsLayout>
