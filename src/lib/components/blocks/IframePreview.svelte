<script lang="ts">
	interface Props {
		src: string;
		title: string;
	}

	const { src, title }: Props = $props();
</script>

<div class="relative w-full overflow-hidden rounded-xl border h-(--block-preview-height)">
	<iframe {src} {title} class="size-full border-0"></iframe>
</div>
