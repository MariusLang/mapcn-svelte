<script lang="ts">
	import * as Card from "$lib/registry/ui/card/index.js";
	import * as Chart from "$lib/registry/ui/chart/index.js";
	import TrendingUp from "@lucide/svelte/icons/trending-up";
	import { curveNatural } from "d3-shape";
	import { Area, AreaChart, PieChart } from "layerchart";
	import {
		deviceCategoryChartConfig,
		deviceCategoryData,
		usersPerDay,
		usersPerDayChartConfig,
	} from "./data.js";
</script>

<Card.Root class="bg-card/70 pointer-events-auto absolute top-4 left-4 z-10 w-60 backdrop-blur-sm">
	<Card.Header class="pb-2">
		<p class="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
			Users in last 7 days
		</p>
		<p class="text-3xl font-semibold tabular-nums">3,803</p>
	</Card.Header>
	<Card.Content class="space-y-4">
		<!-- Tiny area sparkline -->
		<Chart.Container config={usersPerDayChartConfig} class="aspect-auto h-8 w-full">
			<AreaChart
				data={usersPerDay}
				x="day"
				y="users"
				axis={false}
				grid={false}
				tooltip={false}
				highlight={false}
				rule={false}
				points={false}
				labels={false}
				legend={false}
				padding={{ top: 4, bottom: 0 }}
				props={{
					area: {
						curve: curveNatural,
						line: { stroke: "var(--color-blue-500)", "stroke-width": 1.5 },
					},
				}}
			>
				{#snippet marks({ getAreaProps, visibleSeries })}
					<defs>
						<linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stop-color="var(--color-blue-500)" stop-opacity="0.4" />
							<stop offset="100%" stop-color="var(--color-blue-500)" stop-opacity="0" />
						</linearGradient>
					</defs>
					{#each visibleSeries as s, i (s.key)}
						<Area {...getAreaProps(s, i)} fill="url(#sparkline-gradient)" fillOpacity={1} />
					{/each}
				{/snippet}
			</AreaChart>
		</Chart.Container>

		<!-- Trending indicator -->
		<div class="flex items-center gap-1 text-xs text-emerald-500">
			<TrendingUp class="size-3" />
			<span class="font-medium">+12.5%</span>
			<span class="text-muted-foreground">vs previous 7 days</span>
		</div>

		<!-- Device breakdown -->
		<div class="border-t pt-4">
			<p class="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
				Device category in last 7 days
			</p>
			<Chart.Container
				config={deviceCategoryChartConfig}
				class="mx-auto mt-3 aspect-square h-32 w-32"
			>
				<PieChart
					data={deviceCategoryData}
					key="name"
					value="value"
					c="name"
					innerRadius={32}
					outerRadius={52}
					tooltip={false}
					legend={false}
					cRange={deviceCategoryData.map((d) => d.fill)}
					props={{ arc: { stroke: "none" } }}
				/>
			</Chart.Container>
			<div class="mt-3 grid grid-cols-3 gap-2">
				{#each deviceCategoryData as device}
					<div class="text-center">
						<p
							class="text-muted-foreground flex items-center justify-center gap-1.5 text-[10px] tracking-wide uppercase"
						>
							<span class="size-2 shrink-0 rounded-full" style="background-color: {device.fill}"
							></span>
							{device.name}
						</p>
						<p class="text-foreground mt-1 leading-none font-medium tabular-nums">
							{device.value}%
						</p>
					</div>
				{/each}
			</div>
		</div>
	</Card.Content>
</Card.Root>
