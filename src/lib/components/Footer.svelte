<script lang="ts">
	import { cn } from "$lib/utils";
	import MapPin from "@lucide/svelte/icons/map-pin";

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
			{ label: "Upstream (React)", href: "https://github.com/AnmolSaini16/mapcn", external: true },
		],
		resources: [
			{ label: "MapLibre GL", href: "https://maplibre.org/", external: true },
			{ label: "shadcn-svelte", href: "https://www.shadcn-svelte.com/", external: true },
			{ label: "Tailwind CSS", href: "https://tailwindcss.com/", external: true },
		],
	};
</script>

<footer class={cn("mt-24 border-t md:mt-32", className)}>
	<div class="container py-12 md:py-16">
		<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
			<div class="col-span-2 md:col-span-1">
				<a href="/" class="flex w-fit items-center gap-1.5">
					<MapPin class="size-4 shrink-0" />
					<span class="text-lg font-semibold tracking-tight">mapcn-svelte</span>
				</a>
				<p class="text-muted-foreground mt-3 max-w-xs text-sm leading-relaxed">
					Free & open-source, ready-to-use, customizable map components for Svelte.
				</p>
				<p class="text-muted-foreground mt-3 text-sm">
					Built by
					<a
						href="https://github.com/AnmolSaini16"
						target="_blank"
						rel="noopener noreferrer"
						class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
					>
						@anmol
					</a>
					· Ported by
					<a
						href="https://github.com/MariusLang"
						target="_blank"
						rel="noopener noreferrer"
						class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
					>
						@marius
					</a>
				</p>
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
