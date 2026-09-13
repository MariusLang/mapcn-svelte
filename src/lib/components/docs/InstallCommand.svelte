<script lang="ts">
	import Check from "@lucide/svelte/icons/check";
	import Copy from "@lucide/svelte/icons/copy";
	import { Button } from "$lib/registry/ui/button";
	import * as Tabs from "$lib/registry/ui/tabs";
	import { trackEvent } from "$lib/events";

	interface Props {
		name: string;
	}

	const { name }: Props = $props();

	const packageManagers = [
		{ manager: "pnpm", exec: "pnpm dlx" },
		{ manager: "npm", exec: "npx" },
		{ manager: "yarn", exec: "yarn dlx" },
		{ manager: "bun", exec: "bunx --bun" },
	] as const;

	const tabs = $derived(
		packageManagers.map(({ manager, exec }) => ({
			manager,
			command: `${exec} shadcn-svelte@latest add ${name}`,
		}))
	);

	let active = $state<(typeof packageManagers)[number]["manager"]>("pnpm");
	let copied = $state(false);

	async function copyCommand() {
		const current = tabs.find((tab) => tab.manager === active);
		if (!current) return;

		await navigator.clipboard.writeText(current.command);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
		trackEvent({
			name: "copy_install_command",
			properties: { name, packageManager: active },
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
				aria-label={copied ? "Copied" : "Copy command"}
				class="text-muted-foreground"
			>
				{#if copied}
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
