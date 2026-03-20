<script lang="ts">
	import * as Sidebar from "$lib/registry/ui/sidebar/index.js";
	import { Separator } from "$lib/registry/ui/separator/index.js";
	import Network from "@lucide/svelte/icons/network";
	import Plane from "@lucide/svelte/icons/plane";
	import Truck from "@lucide/svelte/icons/truck";
	import { regionLabels, statusConfig, type Hub, type Route } from "./data.js";

	const regionIcons: Record<Hub["region"], string> = {
		west: "W",
		midwest: "MW",
		south: "S",
		northeast: "NE",
	};

	interface Props {
		hubs: Hub[];
		routes: Route[];
	}

	const { hubs, routes }: Props = $props();

	const totalShipments = $derived(routes.reduce((s, r) => s + r.shipments, 0));
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
		<div class="mt-3 grid grid-cols-3 gap-2">
			<div class="bg-background rounded-md border px-2.5 py-2 text-center">
				<p class="text-lg leading-none font-bold tabular-nums">{hubs.length}</p>
				<p class="text-muted-foreground mt-1 text-[10px]">Hubs</p>
			</div>
			<div class="bg-background rounded-md border px-2.5 py-2 text-center">
				<p class="text-lg leading-none font-bold tabular-nums">{activeCount}</p>
				<p class="text-muted-foreground mt-1 text-[10px]">Active</p>
			</div>
			<div class="bg-background rounded-md border px-2.5 py-2 text-center">
				<p class="text-lg leading-none font-bold tabular-nums">{delayedCount}</p>
				<p class="text-muted-foreground mt-1 text-[10px]">Delayed</p>
			</div>
		</div>
	</Sidebar.Header>

	<Separator class="mx-0" />

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Transport Mode</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton tooltipContent="Air" class="pointer-events-none">
							<Plane class="size-4" />
							<span>Air Freight</span>
						</Sidebar.MenuButton>
						<Sidebar.MenuBadge>{airRouteCount}</Sidebar.MenuBadge>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton tooltipContent="Ground" class="pointer-events-none">
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
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							tooltipContent={statusConfig.active.label}
							class="pointer-events-none"
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
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							tooltipContent={statusConfig.delayed.label}
							class="pointer-events-none"
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
					{#each ["west", "midwest", "south", "northeast"] as const as region}
						{@const hubsInRegion = hubs.filter((h) => h.region === region)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton tooltipContent={regionLabels[region]} class="pointer-events-none">
								<span
									class="bg-muted text-muted-foreground flex size-4 items-center justify-center rounded text-[9px] font-bold"
								>
									{regionIcons[region]}
								</span>
								<span>{regionLabels[region]}</span>
							</Sidebar.MenuButton>
							<Sidebar.MenuBadge>{hubsInRegion.length}</Sidebar.MenuBadge>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer class="p-4 pt-0">
		<p class="text-muted-foreground mb-2 text-[11px] font-medium tracking-wider uppercase">
			Summary
		</p>
		<div class="bg-background space-y-1.5 rounded-md border px-3 py-2 text-xs">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Shipments</span>
				<span class="text-primary font-medium tabular-nums">
					{totalShipments.toLocaleString()}
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Routes</span>
				<span class="text-primary font-medium tabular-nums">{routes.length}</span>
			</div>
		</div>
	</Sidebar.Footer>
</Sidebar.Sidebar>
