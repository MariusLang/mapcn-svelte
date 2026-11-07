<script lang="ts">
	import type { Map as MapInstance } from "maplibre-gl";
	import {
		Map,
		MapControls,
		MapGeoJSON,
		MapMarker,
		MapPopup,
		MarkerContent,
		MarkerTooltip,
	} from "$lib/registry/ui/map";
	import { Tabs, TabsList, TabsTrigger } from "$lib/registry/ui/tabs";
	import {
		getAvatarUrl,
		mapView,
		members,
		WORLD_GEOJSON,
		type Member,
		type MemberGroup,
	} from "./data";

	const awakeMembers = members.filter((member) => member.awake);
	let map = $state<MapInstance | null>(null);
	let filter = $state("all");
	let zoom = $state(mapView.zoom);
	let selectedId = $state<string | null>(null);
	const visibleMembers = $derived(filter === "awake" ? awakeMembers : members);
	const groups = $derived(groupMembers(visibleMembers, zoom));
	const selected = $derived(visibleMembers.find((member) => member.id === selectedId));

	function select(member: Member) {
		selectedId = member.id;
		map?.flyTo({ center: [member.lng, member.lat], zoom: mapView.maxZoom });
	}

	function groupMembers(items: Member[], zoom: number) {
		const spacing = (60 / (512 * 2 ** zoom)) * 360;
		const groups: MemberGroup[] = [];
		for (const member of items) {
			const group = groups.find(({ lng, lat }) => {
				const dx = (member.lng - lng) * Math.cos((lat * Math.PI) / 180);
				return Math.hypot(dx, member.lat - lat) < spacing;
			});
			if (!group) {
				groups.push({ lng: member.lng, lat: member.lat, members: [member] });
				continue;
			}
			const count = group.members.push(member);
			group.lng += (member.lng - group.lng) / count;
			group.lat += (member.lat - group.lat) / count;
		}
		return groups;
	}
</script>

{#snippet avatar(member: Member)}
	<span class="relative inline-flex shrink-0">
		<img
			src={getAvatarUrl(member.id)}
			alt=""
			width="32"
			height="32"
			class="bg-muted size-8 rounded-full"
		/>
		<span
			class={[
				"border-background absolute right-0 bottom-0 size-2.5 rounded-full border",
				member.awake ? "bg-emerald-500" : "bg-muted-foreground",
			]}
		></span>
	</span>
{/snippet}

<div class="bg-background flex h-dvh flex-col-reverse md:flex-row">
	<aside
		class="bg-sidebar text-sidebar-foreground flex h-1/2 shrink-0 flex-col md:h-auto md:w-72 md:border-r"
	>
		<div class="border-b p-3">
			<h1 class="text-sm font-medium">Community</h1>
			<p class="text-muted-foreground text-xs tabular-nums">
				{members.length} members, {awakeMembers.length} awake
			</p>
			<Tabs
				bind:value={filter}
				onValueChange={(value) => {
					if (value === "awake" && selected && !selected.awake) selectedId = null;
				}}
				class="mt-3"
			>
				<TabsList class="w-full">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="awake">Awake</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
		<ul class="min-h-0 flex-1 overflow-auto p-2">
			{#each visibleMembers as member (member.id)}
				<li>
					<button
						type="button"
						aria-pressed={selected?.id === member.id}
						onclick={() => select(member)}
						class="hover:bg-accent aria-pressed:bg-accent flex w-full items-center gap-2.5 rounded-md p-2 text-left"
					>
						{@render avatar(member)}
						<span class="min-w-0 flex-1">
							<span class="block truncate text-xs font-medium">{member.name}</span>
							<span class="text-muted-foreground block truncate text-[11px]">{member.city}</span>
						</span>
						<span class="text-muted-foreground text-[11px] tabular-nums">{member.localTime}</span>
					</button>
				</li>
			{/each}
		</ul>
	</aside>

	<div class="relative min-h-0 min-w-0 flex-1">
		<Map
			bind:map
			blank
			projection={{ type: "globe" }}
			center={mapView.center}
			zoom={mapView.zoom}
			options={{ minZoom: mapView.minZoom, maxZoom: mapView.maxZoom }}
			class="[&_.maplibregl-marker[style*='opacity:_0;']]:pointer-events-none [&_.maplibregl-popup[style*='opacity:_0;']_*]:pointer-events-none!"
			onviewportchange={(viewport) => (zoom = Math.round(viewport.zoom * 2) / 2)}
		>
			<MapGeoJSON data={WORLD_GEOJSON} linePaint={false} />
			{#each groups as group (group.members[0].id)}
				{@const member =
					group.members.find((member) => member.id === selected?.id) ?? group.members[0]}
				<MapMarker longitude={group.lng} latitude={group.lat} opacityWhenCovered="0">
					<MarkerContent>
						<button
							type="button"
							aria-label={group.members.length > 1
								? `${member.name} and ${group.members.length - 1} more`
								: member.name}
							onclick={() => select(member)}
							class="bg-background ring-foreground/20 flex items-center rounded-full p-0.5 shadow-sm ring-1"
						>
							{@render avatar(member)}
							{#if group.members.length > 1}
								<span class="px-1.5 text-xs">+{group.members.length - 1}</span>
							{/if}
						</button>
					</MarkerContent>
					{#if !group.members.some(({ id }) => id === selectedId)}
						<MarkerTooltip offset={18} class="min-w-36">
							<ul class="space-y-1.5">
								{#each group.members as item (item.id)}
									<li class="text-[11px]">
										<p class="font-medium">{item.name}</p>
										<p class="text-muted-foreground">
											{item.city} · {item.localTime} · {item.awake ? "Awake" : "Asleep"}
										</p>
									</li>
								{/each}
							</ul>
						</MarkerTooltip>
					{/if}
				</MapMarker>
			{/each}
			{#if selected}
				{#key selected.id}
					<MapPopup
						longitude={selected.lng}
						latitude={selected.lat}
						offset={20}
						closeButton
						closeOnClick={false}
						focusAfterOpen={false}
						locationOccludedOpacity={0}
						onclose={() => (selectedId = null)}
						class="pr-8"
					>
						<div class="flex items-center gap-2.5">
							{@render avatar(selected)}
							<div>
								<p class="text-xs font-medium">{selected.name}</p>
								<p class="text-muted-foreground text-[11px]">{selected.city}</p>
							</div>
						</div>
						<p class="text-muted-foreground mt-2 text-[11px] tabular-nums">
							{selected.localTime} local, {selected.awake ? "awake" : "asleep"}
						</p>
					</MapPopup>
				{/key}
			{/if}
			<MapControls class="bottom-2" />
		</Map>
	</div>
</div>
