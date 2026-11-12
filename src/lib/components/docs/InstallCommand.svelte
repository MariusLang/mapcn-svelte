<script lang="ts">
	import { useCopy } from "$lib/use-copy.svelte";
	import Check from "@lucide/svelte/icons/check";
	import Copy from "@lucide/svelte/icons/copy";
	import { Button } from "$lib/registry/ui/button";
	import * as Tabs from "$lib/registry/ui/tabs";
	import { trackEvent } from "$lib/events";

	interface Props {
		name: string;
		cli?: "shadcn-svelte@latest add" | "skills add";
	}

	const { name, cli = "shadcn-svelte@latest add" }: Props = $props();

	const packageManagers = [
		{ manager: "pnpm", exec: "pnpm dlx" },
		{ manager: "npm", exec: "npx" },
		{ manager: "yarn", exec: "yarn dlx" },
		{ manager: "bun", exec: "bunx --bun" },
	] as const;

	const tabs = $derived(
		packageManagers.map(({ manager, exec }) => ({
			manager,
			command: `${exec} ${cli} ${name}`,
		}))
	);

	let active = $state<(typeof packageManagers)[number]["manager"]>("pnpm");
	const clipboard = useCopy();

	async function copyCommand() {
		const current = tabs.find((tab) => tab.manager === active);
		if (!current || !(await clipboard.copy(current.command))) return;
		trackEvent({
			name: "copy_install_command",
			properties: { name, cli, packageManager: current.manager },
		});
	}
</script>

<div class="bg-surface relative w-full overflow-hidden rounded-lg">
	<Tabs.Tabs bind:value={active} class="gap-0">
		<div class="flex items-center justify-between border-b pr-2 pl-[5px]">
			<Tabs.TabsList
				variant="line"
				class="h-10 bg-transparent group-data-[orientation=horizontal]/tabs:h-10"
			>
				{#each tabs as tab (tab.manager)}
					<Tabs.TabsTrigger value={tab.manager} class="font-mono text-xs">
						{tab.manager}
					</Tabs.TabsTrigger>
				{/each}
			</Tabs.TabsList>
			<Button
				variant="ghost"
				size="icon-sm"
				onclick={copyCommand}
				aria-label={clipboard.label("Copy command")}
				class="text-muted-foreground"
			>
				{#if clipboard.copied}
					<Check />
				{:else}
					<Copy />
				{/if}
			</Button>
		</div>

		{#each tabs as tab (tab.manager)}
			<Tabs.TabsContent value={tab.manager}>
				<pre class="overflow-x-auto p-4 text-sm"><code class="font-mono" data-language="bash"
						>{tab.command}</code
					></pre>
			</Tabs.TabsContent>
		{/each}
	</Tabs.Tabs>
</div>
