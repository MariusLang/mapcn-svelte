<script lang="ts">
	import AgentPrompt from "$lib/components/AgentPrompt.svelte";
	import { Button } from "$lib/registry/ui/button/index";
</script>

<div class="relative">
	<div class="container flex max-w-6xl flex-col items-center gap-4 text-center">
		<h1
			class="animate-fade-up animate-stagger max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
			style="--stagger: 1"
		>
			<span
				class="from-foreground via-foreground to-foreground/65 bg-linear-to-b bg-clip-text text-transparent"
			>
				Beautiful maps, made simple
			</span>
		</h1>

		<p
			class="text-foreground/80 animate-fade-up animate-stagger max-w-2xl sm:text-lg sm:leading-relaxed md:text-xl md:leading-relaxed"
			style="--stagger: 2"
		>
			Ready to use, customizable map components for Svelte.
			<br class="hidden sm:block" />
			Built on MapLibre. Styled with Tailwind.
		</p>

		<div
			class="animate-fade-up animate-stagger mt-5 flex flex-col items-center justify-center gap-4"
			style="--stagger: 3"
		>
			<div class="flex flex-wrap items-center justify-center gap-3">
				<Button href="/docs" class="min-w-36 justify-center">Get Started</Button>
				<Button variant="outline" href="/docs/basic-map" class="min-w-36 justify-center">
					View Components
				</Button>
			</div>
			<AgentPrompt />
		</div>
	</div>
</div>
