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

<div class="bg-muted/50 ring-foreground/5 dark:bg-muted/30 w-full rounded-xl p-1 ring-1">
	<Tabs.Tabs bind:value={active} class="gap-1">
		<div class="flex items-center justify-between p-0.5">
			<Tabs.TabsList
				class="h-8 gap-0.5 bg-transparent p-0 group-data-[orientation=horizontal]/tabs:h-8"
			>
				{#each tabs as tab (tab.manager)}
					<Tabs.TabsTrigger value={tab.manager} class="h-7 flex-none px-2.5 font-mono text-xs">
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
				<pre
					class="bg-background ring-foreground/5 overflow-x-auto rounded-lg p-4 text-sm shadow-xs ring-1"><code
						class="font-mono"
						data-language="bash">{tab.command}</code
					></pre>
			</Tabs.TabsContent>
		{/each}
	</Tabs.Tabs>
</div>
