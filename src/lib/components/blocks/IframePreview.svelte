<script lang="ts">
	import { onMount } from "svelte";
	import { theme } from "$lib/theme";

	interface Props {
		src: string;
		title: string;
	}

	const { src, title }: Props = $props();
	let iframe: HTMLIFrameElement;
	let currentTheme: "light" | "dark" = "light";

	function syncTheme() {
		iframe?.contentWindow?.postMessage(
			{ type: "mapcn:theme", theme: currentTheme },
			window.location.origin
		);
	}

	onMount(() => {
		return theme.subscribe((value) => {
			currentTheme = value;
			syncTheme();
		});
	});
</script>

<div class="relative h-(--block-preview-height) w-full overflow-hidden rounded-xl border">
	<iframe bind:this={iframe} {src} {title} class="size-full border-0" onload={syncTheme}></iframe>
</div>
