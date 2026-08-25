<script lang="ts">
	import { CodeBlock } from "$lib/components/docs/preview";
	import { Card } from "$lib/registry/ui/card";
	import { Map, MapControls } from "$lib/components/ui/map";
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsLink from "$lib/components/docs/DocsLink.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import DocsNote from "$lib/components/docs/DocsNote.svelte";
	import InstallCommand from "$lib/components/docs/InstallCommand.svelte";

	const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? "https://mapcn-svelte.dev";
	const installItem = `${siteUrl}/r/map.json`;
	const cspCode = `script-src 'self' https://unpkg.com;
worker-src 'self' blob:;`;
	const selfHostWorkerCode = `cp node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs \\
   node_modules/maplibre-gl/dist/maplibre-gl-shared.mjs \\
   static/`;
	const workerUrlCode = `MapLibreGL.setWorkerUrl("/maplibre-gl-worker.mjs");`;

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

		<InstallCommand name={installItem} />

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
		<DocsNote>
			<strong>Note:</strong> The map uses free CARTO basemap tiles by default. Tiles automatically switch
			between light and dark themes.
		</DocsNote>
	</DocsSection>

	<DocsSection title="Web Worker">
		<p>
			MapLibre parses tiles in a Web Worker, which ships as a separate file, so mapcn-svelte loads
			it from unpkg, pinned to your installed version. No setup is needed. Under a strict CSP, the
			worker needs:
		</p>
		<CodeBlock code={cspCode} language="bash" showLineNumbers={false} />
		<p>Your basemap host needs its own entries alongside these.</p>
		<p>
			To self-host it instead, copy both files into <DocsCode>static/</DocsCode>. They must sit side
			by side:
		</p>
		<CodeBlock code={selfHostWorkerCode} language="bash" showLineNumbers={false} />
		<p>Then replace the unpkg URL near the top of the component:</p>
		<CodeBlock
			code={workerUrlCode}
			filename="src/lib/components/ui/map/Map.svelte"
			showLineNumbers={false}
		/>
	</DocsSection>
</DocsLayout>
