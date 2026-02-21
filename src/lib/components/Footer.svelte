<script lang="ts">
	import { cn } from "$lib/utils";
	import Button from "$lib/registry/ui/button/button.svelte";

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<footer class={cn("w-full border-t py-5", className)}>
	<div
		class="text-muted-foreground container flex w-full flex-col items-center justify-between gap-2 text-sm sm:flex-row"
	>
		<div class="flex items-center gap-2">
			<span class="text-foreground font-medium">mapcn-svelte</span>
			<span class="text-muted-foreground/80">•</span>
			<span>
				Ported to Svelte by
				<Button
					variant="link"
					size="sm"
					class="px-1"
					href="https://github.com/MariusLang"
					target="_blank"
					rel="noopener noreferrer"
				>
					Marius Lang
				</Button>
			</span>
		</div>
		<div class="flex items-center">
			<Button variant="ghost" size="sm" href="/docs">Documentation</Button>
			<Button
				variant="ghost"
				size="sm"
				href="https://github.com/MariusLang/mapcn-svelte"
				target="_blank"
				rel="noopener noreferrer"
			>
				GitHub
			</Button>
		</div>
	</div>
</footer>
