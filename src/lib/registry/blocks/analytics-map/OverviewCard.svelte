<script lang="ts">
	import * as Card from "$lib/registry/ui/card/index.js";
	import * as Chart from "$lib/registry/ui/chart/index.js";
	import { AreaChart, PieChart } from "layerchart";
	import { usersPerDay, deviceCategoryData } from "./data.js";
	import type { ChartConfig } from "$lib/registry/ui/chart/index.js";

	const totalUsers = usersPerDay.reduce((sum, d) => sum + d.users, 0);

	const usersChartConfig = {
		users: { label: "Users", color: "var(--chart-1)" },
	} satisfies ChartConfig;

	const deviceChartConfig = {
		Desktop: { label: "Desktop", color: "var(--chart-1)" },
		Mobile: { label: "Mobile", color: "var(--chart-2)" },
		Tablet: { label: "Tablet", color: "var(--chart-3)" },
	} satisfies ChartConfig;
</script>

<Card.Root class="pointer-events-auto absolute bottom-8 left-4 z-10 w-72 shadow-lg">
	<Card.Header class="pb-2">
		<div class="flex items-center justify-between">
			<Card.Title class="text-sm font-medium">Active Users</Card.Title>
			<span class="text-muted-foreground text-xs">Last 7 days</span>
		</div>
		<p class="text-2xl font-bold tabular-nums">{totalUsers.toLocaleString()}</p>
	</Card.Header>
	<Card.Content class="space-y-4">
		<!-- Area chart sparkline -->
		<Chart.Container config={usersChartConfig} class="h-16 w-full">
			<AreaChart
				data={usersPerDay}
				x="day"
				series={[{ key: "users", value: "users", color: "var(--chart-1)" }]}
				props={{
					area: { "fill-opacity": 0.2 },
					grid: { x: false, y: false },
				}}
			/>
		</Chart.Container>

		<!-- Donut chart for device breakdown -->
		<div>
			<p class="text-muted-foreground mb-1 text-xs font-medium">Devices</p>
			<div class="flex items-center gap-3">
				<Chart.Container config={deviceChartConfig} class="h-20 w-20 shrink-0">
					<PieChart
						data={deviceCategoryData}
						key="name"
						label="name"
						value="value"
						innerRadius={0.6}
						cRange={["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"]}
					/>
				</Chart.Container>
				<div class="space-y-1.5 text-xs">
					{#each deviceCategoryData as device}
						<div class="flex items-center gap-1.5">
							<span
								class="inline-block size-2 shrink-0 rounded-[2px]"
								style="background-color: {device.name === 'Desktop'
									? 'var(--chart-1)'
									: device.name === 'Mobile'
										? 'var(--chart-2)'
										: 'var(--chart-3)'}"
							></span>
							<span class="text-muted-foreground">{device.name}</span>
							<span class="ml-auto font-medium tabular-nums">{device.value}%</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>
