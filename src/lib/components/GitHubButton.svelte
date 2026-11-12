<script lang="ts">
	import GitHubIcon from "./GitHubIcon.svelte";
	import { githubRepoUrl } from "$lib/docs-navigation";
	import Button from "$lib/registry/ui/button/button.svelte";
	import { onMount } from "svelte";

	async function getGithubStarCount() {
		try {
			const res = await fetch("https://api.github.com/repos/mariuslang/mapcn-svelte");
			if (!res.ok) return null;
			const data = await res.json();
			return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
		} catch {
			return null;
		}
	}

	let stars = $state<number | null>(null);

	onMount(async () => {
		stars = await getGithubStarCount();
	});
</script>

<Button
	href={githubRepoUrl}
	aria-label="mapcn-svelte on GitHub"
	target="_blank"
	rel="noreferrer"
	size="sm"
	variant="ghost"
	class="text-muted-foreground hover:text-foreground h-8 font-normal shadow-none"
>
	<GitHubIcon />
	{#if stars !== null}<span class="text-xs tabular-nums">
			{stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars.toLocaleString()}
		</span>{/if}
</Button>
