<script lang="ts">
	import { cn } from "$lib/utils";
	import Logo from "$lib/components/Logo.svelte";

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();

	const footerLinks = {
		product: [
			{ label: "Documentation", href: "/docs" },
			{ label: "Components", href: "/docs/basic-map" },
			{ label: "Blocks", href: "/blocks" },
		],
		community: [
			{ label: "GitHub", href: "https://github.com/MariusLang/mapcn-svelte", external: true },
			{ label: "Original (React)", href: "https://github.com/AnmolSaini16/mapcn", external: true },
		],
		resources: [
			{ label: "MapLibre GL", href: "https://maplibre.org/", external: true },
			{ label: "shadcn-svelte", href: "https://www.shadcn-svelte.com/", external: true },
			{ label: "Tailwind CSS", href: "https://tailwindcss.com/", external: true },
		],
	};
</script>

<footer class={cn("bg-muted/30 mt-24 border-t md:mt-40", className)}>
	<div class="container py-12 md:py-16">
		<div class="grid grid-cols-2 gap-8 md:grid-cols-5">
			<div class="col-span-2 md:col-span-2">
				<Logo class="w-fit" />
				<p class="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
					Free & open-source, ready-to-use, customizable map components for Svelte.
				</p>
				<div class="mt-4 flex items-center gap-4">
					<a
						href="https://github.com/MariusLang/mapcn-svelte"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub"
						class="text-muted-foreground hover:text-foreground transition-colors"
					>
						<svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
							<path
								d="M12 .7a11.3 11.3 0 0 0-3.6 22c.6.1.8-.2.8-.5v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.6 0-1.2.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.1 1.2a10.8 10.8 0 0 1 5.7 0c2.2-1.5 3.1-1.2 3.1-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.3-2.8 5.3-5.4 5.6.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.5A11.3 11.3 0 0 0 12 .7Z"
							/>
						</svg>
					</a>
				</div>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold">Product</h3>
				<ul class="space-y-2.5">
					{#each footerLinks.product as link}
						<li>
							<a
								href={link.href}
								class="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold">Community</h3>
				<ul class="space-y-2.5">
					{#each footerLinks.community as link}
						<li>
							<a
								href={link.href}
								target={link.external ? "_blank" : undefined}
								rel={link.external ? "noopener noreferrer" : undefined}
								class="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold">Resources</h3>
				<ul class="space-y-2.5">
					{#each footerLinks.resources as link}
						<li>
							<a
								href={link.href}
								target={link.external ? "_blank" : undefined}
								rel={link.external ? "noopener noreferrer" : undefined}
								class="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</footer>
