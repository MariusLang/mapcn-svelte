<script lang="ts">
	import { Button } from "$lib/registry/ui/button/index";

	import CopyButton from "$lib/components/CopyButton.svelte";

	const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? "https://mapcn-svelte.dev";
	const installCommand = `npx shadcn-svelte@latest add ${siteUrl}/r/map.json`;
</script>

<div class="relative">
	<div class="absolute inset-x-0 -inset-y-10 -z-10 overflow-hidden">
		<div
			class="absolute inset-0 opacity-[0.16] dark:opacity-[0.12]"
			style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 24px 24px;"
		></div>
		<div class="absolute -top-40 -right-40 size-96 rounded-full bg-emerald-500/10 blur-3xl"></div>
		<div class="bg-svelte/10 absolute -bottom-40 -left-40 size-96 rounded-full blur-3xl"></div>
		<div
			class="from-background to-background absolute inset-0 bg-linear-to-b via-transparent"
		></div>
	</div>

	<div class="container flex max-w-6xl flex-col items-center gap-4 text-center">
		<h1
			class="animate-fade-up animate-stagger max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
			style="--stagger: 1"
		>
			<span
				class="from-foreground via-foreground to-foreground/65 bg-linear-to-b bg-clip-text text-transparent"
			>
				Beautiful maps, made simple.
			</span>
		</h1>

		<p
			class="text-muted-foreground animate-fade-up animate-stagger max-w-2xl sm:text-lg sm:leading-relaxed md:text-xl md:leading-relaxed"
			style="--stagger: 2"
		>
			Ready to use, customizable map components for Svelte.
			<br class="hidden sm:block" />
			Built on MapLibre. Styled with Tailwind.
		</p>

		<div
			class="animate-fade-up animate-stagger mt-8 hidden w-full max-w-3xl lg:block"
			style="--stagger: 3"
		>
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

		<div
			class="animate-fade-up animate-stagger mt-3 flex flex-wrap items-center justify-center gap-3"
			style="--stagger: 4"
		>
			<Button size="lg" href="/docs">Get Started</Button>
			<Button size="lg" variant="outline" href="/docs/basic-map">View Components</Button>
		</div>
	</div>
</div>
