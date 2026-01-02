<script lang="ts">
	import { Button } from "$lib/registry/ui/button/index";
	import { ArrowRight } from "@lucide/svelte";
	import CopyButton from "$lib/components/CopyButton.svelte";

	const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? "https://mapcn-svelte.vercel.app";
	const installCommand = `npx shadcn-svelte@latest add ${siteUrl}/r/map.json`;
</script>

<div class="mb-12 space-y-6">
	<div class="space-y-4 text-center">
		<h1 class="animate-fade-up text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
			Beautiful maps, made simple.
		</h1>
		<p class="text-foreground/80 animate-fade-up mx-auto max-w-2xl text-lg delay-100">
			Free & open source map components for Svelte. Zero config, one command setup. Built on
			MapLibre GL, styled with Tailwind, works seamlessly with shadcn-svelte.
		</p>
		<p class="text-muted-foreground animate-fade-up mx-auto max-w-2xl text-sm delay-150">
			Svelte port of
			<a
				href="https://mapcn.vercel.app"
				target="_blank"
				rel="noopener noreferrer"
				class="text-foreground font-medium hover:underline"
			>
				mapcn
			</a>
			by
			<a
				href="https://github.com/AnmolSaini16"
				target="_blank"
				rel="noopener noreferrer"
				class="text-foreground font-medium hover:underline"
			>
				Anmol
			</a>. Ported by
			<a
				href="https://github.com/MariusLang"
				target="_blank"
				rel="noopener noreferrer"
				class="text-foreground font-medium hover:underline"
			>
				Marius Lang
			</a>.
		</p>
	</div>

	<div class="animate-fade-up flex w-full justify-center px-4 delay-200">
		<div
			class="bg-secondary/50 border-border/50 inline-flex max-w-full items-center gap-3 overflow-x-auto rounded-full border px-5 py-2.5 font-mono text-sm"
		>
			<span class="text-muted-foreground shrink-0">$</span>
			<code>{installCommand}</code>
			<CopyButton command={installCommand} />
		</div>
	</div>

	<div class="animate-fade-up flex flex-wrap items-center justify-center gap-3 delay-300">
		<Button>
			<a href="/docs" class="inline-flex items-center gap-2">
				Get Started
				<ArrowRight class="size-4" />
			</a>
		</Button>
		<Button variant="outline" size="lg">
			<a href="/docs/basic-map">View Examples</a>
		</Button>
	</div>
</div>
