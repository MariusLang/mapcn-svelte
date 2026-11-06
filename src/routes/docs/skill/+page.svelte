<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsLink from "$lib/components/docs/DocsLink.svelte";
	import DocsCode from "$lib/components/docs/DocsCode.svelte";
	import InstallCommand from "$lib/components/docs/InstallCommand.svelte";
	import { CodeBlock } from "$lib/components/docs/preview";
	import { githubRepoUrl } from "$lib/docs-navigation";
	import { skillSource } from "$lib/llm-prompts";

	const prompts = [
		"Where could a map help in this app?",
		"Add a store locator for our locations.",
		"Show the delivery route on the order page with live progress.",
		"Make a choropleth of revenue by country.",
		"Draw arcs between our offices on a globe.",
	];
	const skillTree = `skills/mapcn-svelte/
├── SKILL.md           # workflow, install, rules, basemaps
└── references/
    ├── components.md  # exports, docs, and example links
    ├── blocks.md      # installs and file targets
    └── patterns.md    # recipes beyond the basics`;
</script>

<svelte:head>
	<title>Agent Skill - mapcn-svelte</title>
	<meta
		name="description"
		content="Teach your coding agent to install MapCN Svelte and build maps with its components and blocks."
	/>
</svelte:head>

<DocsLayout
	pathname="/docs/skill"
	title="Agent Skill"
	description="Teach your coding agent MapCN Svelte so it can install the right components and build maps in your app."
>
	<DocsSection title="Installation">
		<InstallCommand cli="skills add" name={skillSource} />
		<p>
			The skill works with Claude Code, Cursor, Codex, and other agents that support skills. For
			manual installation, copy the whole
			<DocsLink href={`${githubRepoUrl}/tree/main/skills/mapcn-svelte`}
				>skills/mapcn-svelte</DocsLink
			>
			folder into <DocsCode>.claude/skills/</DocsCode> or your agent’s skills directory.
		</p>
		<p>
			Ask for a map to let your agent discover the skill. You can also ask where a map would fit in
			your project.
		</p>
		<p>
			For agents without skill support, point them to <DocsLink href="/llms.txt">llms.txt</DocsLink
			>.
		</p>
	</DocsSection>

	<DocsSection title="What it knows">
		<ul>
			<li>
				<strong>Setup.</strong> Checks your shadcn-svelte aliases, reuses installed components, and installs
				missing map components or blocks.
			</li>
			<li>
				<strong>Map basics.</strong> Gives the map a height, keeps coordinates in <DocsCode
					>[lng, lat]</DocsCode
				> order, and fetches directions outside the map.
			</li>
			<li>
				<strong>Basemaps.</strong> Chooses street tiles, a blank canvas for data layers, or a custom style.
			</li>
			<li>
				<strong>Recipes.</strong> Covers camera control, live route progress, custom layers, large datasets,
				and strict CSP.
			</li>
			<li>
				<strong>Components and blocks.</strong> Links each API group to its documentation and working
				Svelte examples, and lists what each block installs.
			</li>
		</ul>
	</DocsSection>

	<DocsSection title="Try asking">
		<ul>
			{#each prompts as prompt (prompt)}
				<li>“{prompt}”</li>
			{/each}
		</ul>
	</DocsSection>

	<DocsSection title="What's inside">
		<p>
			The component and block references are generated from the same exports, docs examples, and
			registry used by this site. Your agent can read the reference that fits the task.
		</p>
		<CodeBlock code={skillTree} language="bash" showLineNumbers={false} showCopyButton={false} />
	</DocsSection>
</DocsLayout>
