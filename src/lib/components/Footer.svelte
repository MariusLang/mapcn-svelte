<script lang="ts">
	import { cn } from "$lib/utils";

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<footer class={cn("border-border/40 bg-muted/20 w-full border-t py-8", className)}>
	<div
		class="text-muted-foreground container flex flex-col items-center justify-between gap-4 text-sm sm:flex-row"
	>
		<div class="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
			<span>
				Built by
				<a
					href="https://github.com/AnmolSaini16"
					target="_blank"
					rel="noopener noreferrer"
					class="text-foreground font-medium underline-offset-4 hover:underline"
				>
					Anmol
				</a>
				<span class="text-border">•</span>
				Ported to Svelte by
				<a
					href="https://github.com/MariusLang"
					target="_blank"
					rel="noopener noreferrer"
					class="text-foreground font-medium underline-offset-4 hover:underline"
				>
					Marius Lang
				</a>
			</span>
		</div>
		<div class="flex items-center gap-6">
			<a href="/docs" class="hover:text-foreground transition-colors">Documentation</a>
			<a
				href="https://github.com/AnmolSaini16/mapcn"
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-foreground transition-colors"
			>
				GitHub
			</a>
		</div>
	</div>
</footer>
