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
	class="decoration-foreground/25 hover:text-foreground hover:decoration-foreground/60 underline decoration-1 underline-offset-[5px] transition-colors"
>
	{@render children?.()}
</a>
