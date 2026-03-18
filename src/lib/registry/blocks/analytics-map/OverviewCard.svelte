<script lang="ts">
	import * as Card from "$lib/registry/ui/card/index.js";
	import { usersPerDay, deviceCategoryData } from "./data.js";

	const maxUsers = Math.max(...usersPerDay.map((d) => d.users));
	const totalUsers = usersPerDay.reduce((sum, d) => sum + d.users, 0);
</script>

<Card.Root
	class="pointer-events-auto absolute bottom-8 left-4 z-10 w-72 shadow-lg"
>
	<Card.Header class="pb-2">
		<div class="flex items-center justify-between">
			<Card.Title class="text-sm font-medium">Active Users</Card.Title>
			<span class="text-muted-foreground text-xs">Last 7 days</span>
		</div>
		<p class="text-2xl font-bold tabular-nums">{totalUsers.toLocaleString()}</p>
	</Card.Header>
	<Card.Content class="space-y-4">
		<!-- Bar chart -->
		<div class="flex h-16 items-end gap-1">
			{#each usersPerDay as day}
				{@const height = Math.round((day.users / maxUsers) * 100)}
				<div class="flex flex-1 flex-col items-center gap-1">
					<div
						class="w-full rounded-sm bg-blue-500"
						style="height: {height}%"
					></div>
					<span class="text-muted-foreground text-[10px]">{day.day}</span>
				</div>
			{/each}
		</div>

		<!-- Device breakdown -->
		<div>
			<p class="text-muted-foreground mb-2 text-xs font-medium">Devices</p>
			<div class="space-y-1.5">
				{#each deviceCategoryData as device}
					<div class="flex items-center justify-between text-xs">
						<span class="text-muted-foreground">{device.name}</span>
						<span class="font-medium tabular-nums">{device.value}%</span>
					</div>
					<div class="bg-muted h-1 w-full overflow-hidden rounded-full">
						<div
							class="h-full rounded-full bg-blue-500"
							style="width: {device.value}%"
						></div>
					</div>
				{/each}
			</div>
		</div>
	</Card.Content>
</Card.Root>
