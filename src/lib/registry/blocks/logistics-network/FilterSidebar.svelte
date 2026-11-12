<script lang="ts">
	import * as Sidebar from "$lib/registry/ui/sidebar/index.js";
	import { Separator } from "$lib/registry/ui/separator/index.js";
	import MapPin from "@lucide/svelte/icons/map-pin";
	import Network from "@lucide/svelte/icons/network";
	import Plane from "@lucide/svelte/icons/plane";
	import Truck from "@lucide/svelte/icons/truck";
	import { regionLabels, statusConfig, type Filter, type Hub, type Route } from "./data.js";

	interface Props {
		hubs: Hub[];
		routes: Route[];
		visibleRoutes: Route[];
		hidden: Set<Filter>;
		ontoggle: (filter: Filter) => void;
	}

	const { hubs, routes, visibleRoutes, hidden, ontoggle }: Props = $props();

	const totalShipments = $derived(visibleRoutes.reduce((s, r) => s + r.shipments, 0));
	const onTimeShipments = $derived(
		visibleRoutes
			.filter((route) => route.status === "active")
			.reduce((sum, route) => sum + route.shipments, 0)
	);
	const delayedShipments = $derived(totalShipments - onTimeShipments);
	const onTimeRate = $derived(
		totalShipments ? Math.round((onTimeShipments / totalShipments) * 100) : 0
	);
	const activeCount = $derived(routes.filter((r) => r.status === "active").length);
	const delayedCount = $derived(routes.filter((r) => r.status === "delayed").length);
	const airRouteCount = $derived(routes.filter((r) => r.mode === "air").length);
	const groundRouteCount = $derived(routes.filter((r) => r.mode === "ground").length);
</script>

<Sidebar.Sidebar collapsible="offcanvas">
	<Sidebar.Header class="p-4">
		<div class="flex items-center gap-2">
			<div
				class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
			>
				<Network class="size-4" />
			</div>
			<div class="flex flex-col gap-0.5 leading-none">
				<span class="text-sm font-medium">Logistics Network</span>
				<span class="text-muted-foreground text-xs">Domestic Routes</span>
			</div>
		</div>
	</Sidebar.Header>

	<Separator class="mx-0" />

	<Sidebar.Content>
		<Sidebar.Group class="gap-3 px-4 pt-4 pb-2">
			<dl class="grid grid-cols-2 gap-4">
				<div class="flex flex-col gap-1">
					<dt class="text-muted-foreground text-xs">Shipments</dt>
					<dd class="text-lg font-medium tabular-nums">{totalShipments.toLocaleString()}</dd>
				</div>
				<div class="flex flex-col gap-1">
					<dt class="text-muted-foreground text-xs">On time</dt>
					<dd class="text-lg font-medium tabular-nums">{onTimeRate}%</dd>
				</div>
			</dl>
			<div class="flex h-1 gap-0.5" aria-hidden="true">
				{#each [["active", onTimeShipments], ["delayed", delayedShipments]] as const as [status, count] (status)}
					{#if count > 0}
						<span
							class="rounded-full"
							style:flex-grow={count}
							style:background-color={statusConfig[status].color}
						></span>
					{/if}
				{/each}
			</div>
		</Sidebar.Group>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Transport Mode</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem class={["transition-opacity", hidden.has("air") && "opacity-50"]}>
						<Sidebar.MenuButton
							tooltipContent="Air"
							onclick={() => ontoggle("air")}
							aria-pressed={!hidden.has("air")}
						>
							<Plane class="size-4" />
							<span>Air Freight</span>
						</Sidebar.MenuButton>
						<Sidebar.MenuBadge>{airRouteCount}</Sidebar.MenuBadge>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem class={["transition-opacity", hidden.has("ground") && "opacity-50"]}>
						<Sidebar.MenuButton
							tooltipContent="Ground"
							onclick={() => ontoggle("ground")}
							aria-pressed={!hidden.has("ground")}
						>
							<Truck class="size-4" />
							<span>Ground</span>
						</Sidebar.MenuButton>
						<Sidebar.MenuBadge>{groundRouteCount}</Sidebar.MenuBadge>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<Sidebar.Group>
			<Sidebar.GroupLabel>Status</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem class={["transition-opacity", hidden.has("active") && "opacity-50"]}>
						<Sidebar.MenuButton
							tooltipContent={statusConfig.active.label}
							onclick={() => ontoggle("active")}
							aria-pressed={!hidden.has("active")}
						>
							<span class="flex size-4 items-center justify-center">
								<span
									class="size-2 rounded-full"
									style="background-color: {statusConfig.active.color}"
								></span>
							</span>
							<span>{statusConfig.active.label}</span>
						</Sidebar.MenuButton>
						<Sidebar.MenuBadge>{activeCount}</Sidebar.MenuBadge>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem class={["transition-opacity", hidden.has("delayed") && "opacity-50"]}>
						<Sidebar.MenuButton
							tooltipContent={statusConfig.delayed.label}
							onclick={() => ontoggle("delayed")}
							aria-pressed={!hidden.has("delayed")}
						>
							<span class="flex size-4 items-center justify-center">
								<span
									class="size-2 rounded-full"
									style="background-color: {statusConfig.delayed.color}"
								></span>
							</span>
							<span>{statusConfig.delayed.label}</span>
						</Sidebar.MenuButton>
						<Sidebar.MenuBadge>{delayedCount}</Sidebar.MenuBadge>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<Sidebar.Group>
			<Sidebar.GroupLabel>Region</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each ["west", "midwest", "south", "northeast"] as const as region (region)}
						{@const hubsInRegion = hubs.filter((h) => h.region === region)}
						<Sidebar.MenuItem class={["transition-opacity", hidden.has(region) && "opacity-50"]}>
							<Sidebar.MenuButton
								tooltipContent={regionLabels[region]}
								onclick={() => ontoggle(region)}
								aria-pressed={!hidden.has(region)}
							>
								<MapPin class="size-4" />
								<span>{regionLabels[region]}</span>
							</Sidebar.MenuButton>
							<Sidebar.MenuBadge>{hubsInRegion.length}</Sidebar.MenuBadge>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Sidebar>
