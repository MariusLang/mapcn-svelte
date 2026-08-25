<script lang="ts">
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from "$lib/registry/ui/table";
	import DocsCode from "./DocsCode.svelte";

	const { props, title } = $props<{
		props: {
			name: string;
			type: string;
			default?: string;
			description: string;
		}[];
		title?: string;
	}>();
</script>

<div class="prop-table space-y-3 [.prop-table+&]:mt-8">
	{#if title}
		<h3 class="text-foreground font-semibold">{title}</h3>
	{/if}
	<div class="overflow-hidden">
		<Table
			class="[&_tbody_tr:last-child]:border-b [&_td:first-child]:pl-0 [&_td:last-child]:pr-0 [&_th:first-child]:pl-0 [&_th:last-child]:pr-0"
		>
			<TableHeader>
				<TableRow>
					<TableHead class="h-10 text-xs font-medium">Prop</TableHead>
					<TableHead class="h-10 text-xs font-medium">Type</TableHead>
					<TableHead class="h-10 text-xs font-medium">Default</TableHead>
					<TableHead class="h-10 text-xs font-medium">Description</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{#each props as prop}
					<TableRow>
						<TableCell class="text-primary py-3 align-top font-mono">
							<DocsCode className="text-[13px]">{prop.name}</DocsCode>
						</TableCell>

						<TableCell class="text-muted-foreground py-3 align-top font-mono whitespace-normal">
							<DocsCode className="text-xs">{prop.type}</DocsCode>
						</TableCell>

						<TableCell class="text-muted-foreground py-3 align-top font-mono">
							<DocsCode className="text-xs whitespace-normal">{prop.default ?? "—"}</DocsCode>
						</TableCell>

						<TableCell
							class="text-muted-foreground min-w-45 py-3 text-sm leading-relaxed whitespace-normal"
						>
							{prop.description}
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
