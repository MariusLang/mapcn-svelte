<script lang="ts">
	import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
	import DocsSection from "$lib/components/docs/DocsSection.svelte";
	import DocsLink from "$lib/components/docs/DocsLink.svelte";
	import AgentPrompt from "$lib/components/AgentPrompt.svelte";
</script>

<svelte:head>
	<title>Agent Skill - mapcn-svelte</title>
</svelte:head>

<DocsLayout
	pathname="/docs/skill"
	title="Agent Skill"
	description="Give your coding agent the MapCN Svelte registry and component conventions."
>
	<DocsSection title="Use the skill">
		<p>
			Add the <DocsLink
				href="https://github.com/MariusLang/mapcn-svelte/tree/main/skills/mapcn-svelte"
				>MapCN Svelte skill</DocsLink
			>
			to your agent’s skills directory. It covers registry installation, component composition, viewport
			control, and MapLibre worker setup.
		</p>
		<AgentPrompt />
	</DocsSection>
</DocsLayout>
