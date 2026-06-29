<script lang="ts">
	import * as Card from "$lib/registry/ui/card/index.js";
	import TrendingUp from "@lucide/svelte/icons/trending-up";
	import { deviceCategoryData, usersPerDay } from "./data.js";

	const sparklineWidth = 208;
	const sparklineHeight = 32;
	const sparklinePadding = 2;
	const sparklineValues = usersPerDay.map((day) => day.users);
	const sparklineMin = Math.min(...sparklineValues);
	const sparklineMax = Math.max(...sparklineValues);
	const sparklineRange = sparklineMax - sparklineMin || 1;
	const sparklinePoints = usersPerDay.map((day, index) => {
		const x = (index / (usersPerDay.length - 1)) * sparklineWidth;
		const y =
			sparklinePadding +
			(1 - (day.users - sparklineMin) / sparklineRange) * (sparklineHeight - sparklinePadding * 2);

		return { x, y };
	});
	const sparklinePath = sparklinePoints
		.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
		.join(" ");
	const sparklineAreaPath = `${sparklinePath} L ${sparklineWidth} ${sparklineHeight} L 0 ${sparklineHeight} Z`;
	const donutRadius = 44;
	const donutStrokeWidth = 20;
	const donutCircumference = 2 * Math.PI * donutRadius;
	let donutOffset = 0;
	const donutSegments = deviceCategoryData.map((device) => {
		const length = (device.value / 100) * donutCircumference;
		const segment = {
			...device,
			length,
			offset: donutOffset,
		};

		donutOffset += length;
		return segment;
	});
</script>

<Card.Root class="bg-card/80 pointer-events-auto absolute top-4 left-4 z-10 w-60 backdrop-blur-sm">
	<Card.Header>
		<p class="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
			Users in last 30 days
		</p>
		<p class="text-3xl font-semibold tabular-nums">17,234</p>
	</Card.Header>
	<Card.Content class="space-y-4">
		<!-- Tiny area sparkline -->
		<svg
			class="h-8 w-full overflow-visible"
			viewBox="0 0 {sparklineWidth} {sparklineHeight}"
			role="img"
			aria-label="Users trend over the last 30 days"
		>
			<defs>
				<linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="var(--color-neutral-500)" stop-opacity="0.35" />
					<stop offset="100%" stop-color="var(--color-neutral-500)" stop-opacity="0" />
				</linearGradient>
			</defs>
			<path d={sparklineAreaPath} fill="url(#sparkline-gradient)" />
			<path
				d={sparklinePath}
				fill="none"
				stroke="var(--color-neutral-500)"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
			/>
		</svg>

		<!-- Trending indicator -->
		<div class="mt-2 flex items-center gap-1.5 text-xs">
			<TrendingUp class="text-foreground size-3" />
			<span class="text-foreground font-medium">+12.5%</span>
			<span class="text-muted-foreground">vs previous 30 days</span>
		</div>

		<!-- Device breakdown -->
		<div class="border-border/60 border-t pt-4">
			<p class="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
				Device category in last 30 days
			</p>
			<svg
				class="mx-auto mt-3 h-32 w-32 -rotate-90"
				viewBox="0 0 128 128"
				role="img"
				aria-label="Device category breakdown"
			>
				{#each donutSegments as segment}
					<circle
						cx="64"
						cy="64"
						r={donutRadius}
						fill="none"
						stroke={segment.fill}
						stroke-dasharray="{segment.length} {donutCircumference - segment.length}"
						stroke-dashoffset={-segment.offset}
						stroke-linecap="butt"
						stroke-width={donutStrokeWidth}
					/>
				{/each}
			</svg>
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
