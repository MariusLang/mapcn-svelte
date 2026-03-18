<script lang="ts">
	interface Props {
		src: string;
		title: string;
	}

	const { src, title }: Props = $props();
</script>

<div class="relative h-(--block-preview-height) w-full overflow-hidden rounded-xl border">
	<iframe {src} {title} class="size-full border-0"></iframe>
</div>
