<script lang="ts">
	const {
		href,
		external = /^https?:\/\//.test(href),
		children,
	} = $props<{
		href: string;
		external?: boolean;
		children?: import("svelte").Snippet;
	}>();
</script>

<a
	{href}
	target={external ? "_blank" : undefined}
	rel={external ? "noopener noreferrer" : undefined}
	class="text-foreground decoration-foreground/25 hover:decoration-foreground/60 underline underline-offset-4 transition-colors"
>
	{@render children?.()}
</a>
