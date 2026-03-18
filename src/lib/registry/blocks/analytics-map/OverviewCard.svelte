<script lang="ts">
	import * as Card from "$lib/registry/ui/card/index.js";
	import * as Chart from "$lib/registry/ui/chart/index.js";
	import { AreaChart, PieChart } from "layerchart";
	import TrendingUp from "@lucide/svelte/icons/trending-up";
	import { usersPerDay, deviceCategoryData } from "./data.js";
	import type { ChartConfig } from "$lib/registry/ui/chart/index.js";

	const usersChartConfig = {
		users: { label: "Users", color: "var(--chart-1)" },
	} satisfies ChartConfig;

	const deviceChartConfig = {
		Desktop: { label: "Desktop", color: "var(--color-blue-500)" },
		Mobile: { label: "Mobile", color: "var(--color-emerald-500)" },
		Tablet: { label: "Tablet", color: "var(--color-violet-500)" },
	} satisfies ChartConfig;
</script>

<Card.Root class="pointer-events-auto absolute top-4 left-4 z-10 w-60 bg-card/70 backdrop-blur-sm">
	<Card.Header class="pb-2">
		<p class="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
			Users in last 7 days
		</p>
		<p class="text-3xl font-semibold tabular-nums">3,803</p>
	</Card.Header>
	<Card.Content class="space-y-4">
		<!-- Tiny area sparkline -->
		<Chart.Container config={usersChartConfig} class="aspect-auto h-8 w-full">
			<AreaChart
				data={usersPerDay}
				x="day"
				series={[{ key: "users", value: "users", color: "var(--chart-1)" }]}
				props={{
					area: { "fill-opacity": 0.3 },
					grid: { x: false, y: false },
				}}
			/>
		</Chart.Container>

		<!-- Trending indicator -->
		<div class="flex items-center gap-1 text-xs text-emerald-500">
			<TrendingUp class="size-3" />
			<span class="font-medium">+12.5%</span>
			<span class="text-muted-foreground">vs previous 7 days</span>
		</div>

		<!-- Device breakdown -->
		<div class="border-t pt-4">
			<Chart.Container config={deviceChartConfig} class="mx-auto h-32 w-32">
				<PieChart
					data={deviceCategoryData}
					key="name"
					label="name"
					value="value"
					innerRadius={0.6}
					cRange={["var(--color-blue-500)", "var(--color-emerald-500)", "var(--color-violet-500)"]}
				/>
			</Chart.Container>
			<div class="mt-3 grid grid-cols-3 gap-1 text-[10px]">
				{#each deviceCategoryData as device}
					<div class="flex flex-col items-center gap-0.5">
						<span
							class="inline-block size-2 rounded-full"
							style="background-color: {device.name === 'Desktop'
								? 'var(--color-blue-500)'
								: device.name === 'Mobile'
									? 'var(--color-emerald-500)'
									: 'var(--color-violet-500)'}"
						></span>
						<span class="text-muted-foreground">{device.name}</span>
						<span class="font-medium tabular-nums">{device.value}%</span>
					</div>
				{/each}
			</div>
		</div>
	</Card.Content>
</Card.Root>
