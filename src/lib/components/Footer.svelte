<script lang="ts">
	import { cn } from "$lib/utils";

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<footer class={cn("border-border/40 w-full border-t px-6 py-6", className)}>
	<div class="text-muted-foreground mx-auto flex max-w-5xl items-center justify-between text-xs">
		<span>
			Built by
			<a
				href="https://github.com/AnmolSaini16"
				target="_blank"
				rel="noopener noreferrer"
				class="text-foreground font-medium hover:underline"
			>
				Anmol
			</a>. Ported to Svelte by
			<a
				href="https://github.com/MariusLang"
				target="_blank"
				rel="noopener noreferrer"
				class="text-foreground font-medium hover:underline"
			>
				Marius Lang
			</a>.
		</span>
		<div class="flex items-center gap-4">
			<a
				href="https://github.com/MariusLang/mapcn-svelte"
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-foreground transition-colors"
			>
				GitHub
			</a>
			<a href="/docs" class="hover:text-foreground transition-colors"> Docs </a>
		</div>
	</div>
</footer>
