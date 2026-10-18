<script lang="ts">
	import GitHubIcon from "./GitHubIcon.svelte";
	import { githubRepoUrl } from "$lib/docs-navigation";
	import Button from "$lib/registry/ui/button/button.svelte";
	import { onMount } from "svelte";

	const FALLBACK_STAR_COUNT = 160;

	async function getGithubStarCount() {
		try {
			const res = await fetch("https://api.github.com/repos/mariuslang/mapcn-svelte");
			const data = await res.json();
			return data.stargazers_count ?? FALLBACK_STAR_COUNT;
		} catch (error) {
			console.error(error);
			return FALLBACK_STAR_COUNT;
		}
	}

	let stars = $state(FALLBACK_STAR_COUNT);

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
	class="h-8 shadow-none"
>
	<GitHubIcon />
	<span class="text-muted-foreground pt-0.5 text-xs tabular-nums">
		{stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars.toLocaleString()}
	</span>
</Button>
