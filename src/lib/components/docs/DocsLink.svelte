<script lang="ts">
	const {
		href,
		external = false,
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
	class="text-foreground hover:text-primary font-medium underline underline-offset-4 transition-colors"
>
	{@render children?.()}
</a>
