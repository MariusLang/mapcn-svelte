<script lang="ts">
	import { Button } from "$lib/registry/ui/button/index";
	import { ArrowRight } from "@lucide/svelte";
	import CopyButton from "$lib/components/CopyButton.svelte";

	const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? "https://mapcn-svelte.vercel.app";
	const installCommand = `npx shadcn-svelte@latest add ${siteUrl}/r/map.json`;
</script>

<div class="relative">
	<div class="absolute inset-0 -z-10 overflow-hidden">
		<div
			class="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
			style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 24px 24px;"
		></div>
	</div>
	<div class="absolute -top-40 -right-40 size-96 rounded-full bg-emerald-500/10 blur-3xl"></div>
	<div class="absolute -bottom-40 -left-40 size-96 rounded-full bg-sky-500/10 blur-3xl"></div>
	<div class="from-background to-background absolute inset-0 bg-linear-to-b via-transparent"></div>
</div>
<div class="container flex flex-col items-center text-center">
	<h1
		class="animate-fade-up text-4xl font-semibold tracking-tight delay-100 sm:text-5xl md:text-6xl"
	>
		Beautiful maps, made simple.
	</h1>
	<p
		class="text-foreground/80 animate-fade-up mt-6 max-w-lg text-lg leading-relaxed delay-200 md:text-xl"
	>
		Free & open source map components for Svelte. Built on MapLibre GL, styled with Tailwind, works
		seamlessly with shadcn-svelte.
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

<div class="animate-fade-up mt-8 w-full max-w-xl delay-300">
	<div class="bg-card border-border overflow-hidden rounded-lg border shadow-sm">
		<div class="border-border/50 flex items-center gap-1.5 border-b px-3 py-2">
			<span class="size-2.5 rounded-full bg-red-500/40"></span>
			<span class="size-2.5 rounded-full bg-yellow-500/40"></span>
			<span class="size-2.5 rounded-full bg-green-500/40"></span>
		</div>

		<div class="flex items-center gap-3 px-4 py-3 font-mono text-sm">
			<span class="shrink-0 text-emerald-500">$</span>
			<code class="text-foreground/80 flex-1 truncate text-left">
				{installCommand}
			</code>
			<CopyButton command={installCommand} />
		</div>
	</div>
</div>

<div class="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3 delay-400">
	<Button size="lg">
		<a href="/docs" class="inline-flex items-center gap-2">
			Get Started
			<ArrowRight class="size-4" />
		</a>
	</Button>
	<Button variant="ghost" size="lg">
		<a href="/docs/basic-map">View Components</a>
	</Button>
</div>
