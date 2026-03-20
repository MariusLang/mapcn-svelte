<script lang="ts">
	import * as Card from "$lib/registry/ui/card/index.js";
	import TrendingUp from "@lucide/svelte/icons/trending-up";
	import { usersPerDay, deviceCategoryData } from "./data.js";

	// Sparkline path computation
	const svgWidth = 200;
	const svgHeight = 32;
	const values = usersPerDay.map((d) => d.users);
	const minVal = Math.min(...values);
	const maxVal = Math.max(...values);
	const range = maxVal - minVal || 1;

	const points = values.map((v, i) => {
		const x = (i / (values.length - 1)) * svgWidth;
		const y = svgHeight - ((v - minVal) / range) * svgHeight;
		return `${x},${y}`;
	});
	const linePath = `M${points.join(" L")}`;
	const areaPath = `${linePath} L${svgWidth},${svgHeight} L0,${svgHeight} Z`;

	// Donut chart computation
	const donutSize = 128;
	const donutCenter = donutSize / 2;
	const outerRadius = 56;
	const innerRadius = 34; // ~60% of outer
	const total = deviceCategoryData.reduce((sum, d) => sum + d.value, 0);

	function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
		const rad = ((angleDeg - 90) * Math.PI) / 180;
		return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
	}

	function arcPath(startAngle: number, endAngle: number, outerR: number, innerR: number) {
		const s1 = polarToCartesian(donutCenter, donutCenter, outerR, startAngle);
		const e1 = polarToCartesian(donutCenter, donutCenter, outerR, endAngle);
		const s2 = polarToCartesian(donutCenter, donutCenter, innerR, endAngle);
		const e2 = polarToCartesian(donutCenter, donutCenter, innerR, startAngle);
		const largeArc = endAngle - startAngle > 180 ? 1 : 0;
		return [
			`M ${s1.x} ${s1.y}`,
			`A ${outerR} ${outerR} 0 ${largeArc} 1 ${e1.x} ${e1.y}`,
			`L ${s2.x} ${s2.y}`,
			`A ${innerR} ${innerR} 0 ${largeArc} 0 ${e2.x} ${e2.y}`,
			"Z",
		].join(" ");
	}

	let currentAngle = 0;
	const donutSlices = deviceCategoryData.map((d) => {
		const sliceAngle = (d.value / total) * 360;
		const startAngle = currentAngle;
		// Clamp to avoid full-circle rendering issues
		const endAngle = currentAngle + Math.min(sliceAngle, 359.99);
		currentAngle += sliceAngle;
		return { ...d, path: arcPath(startAngle, endAngle, outerRadius, innerRadius) };
	});

	const deviceColors: Record<string, string> = {
		Desktop: "var(--color-blue-500)",
		Mobile: "var(--color-sky-500)",
		Tablet: "var(--color-blue-300)",
	};
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
		<svg viewBox="0 0 {svgWidth} {svgHeight}" class="h-8 w-full" preserveAspectRatio="none">
			<path d={areaPath} fill="var(--chart-1)" fill-opacity="0.3" />
			<path d={linePath} fill="none" stroke="var(--chart-1)" stroke-width="1.5" />
		</svg>

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
			<svg viewBox="0 0 {donutSize} {donutSize}" class="mx-auto h-32 w-32">
				{#each donutSlices as slice}
					<path d={slice.path} fill={deviceColors[slice.name]} />
				{/each}
			</svg>
			<div class="mt-3 grid grid-cols-3 gap-1 text-[10px]">
				{#each deviceCategoryData as device}
					<div class="flex flex-col items-center gap-0.5">
						<span
							class="inline-block size-2 rounded-full"
							style="background-color: {deviceColors[device.name]}"
						></span>
						<span class="text-muted-foreground uppercase">{device.name}</span>
						<span class="font-medium tabular-nums">{device.value}%</span>
					</div>
				{/each}
			</div>
		</div>
	</Card.Content>
</Card.Root>
