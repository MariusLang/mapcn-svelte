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

	export let props: {
		name: string;
		type: string;
		default?: string;
		description: string;
	}[];
</script>

<div class="my-4 overflow-hidden rounded-lg border">
	<Table>
		<TableHeader>
			<TableRow class="hover:bg-transparent">
				<TableHead class="h-11 px-4 font-medium">Prop</TableHead>
				<TableHead class="h-11 px-4 font-medium">Type</TableHead>
				<TableHead class="h-11 px-4 font-medium">Default</TableHead>
				<TableHead class="h-11 px-4 font-medium">Description</TableHead>
			</TableRow>
		</TableHeader>

		<TableBody>
			{#each props as prop}
				<TableRow>
					<TableCell class="text-primary px-4 py-3.5 align-top font-mono">
						<DocsCode className="text-[13px]">
							{prop.name}
						</DocsCode>
					</TableCell>

					<TableCell class="text-muted-foreground px-4 py-3.5 align-top font-mono">
						<DocsCode className="text-xs">{prop.type}</DocsCode>
					</TableCell>

					<TableCell class="text-muted-foreground px-4 py-3.5 align-top font-mono">
						<DocsCode className="text-xs">
							{prop.default ?? "—"}
						</DocsCode>
					</TableCell>

					<TableCell class="text-muted-foreground px-4 py-3.5 text-sm leading-relaxed">
						{prop.description}
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
