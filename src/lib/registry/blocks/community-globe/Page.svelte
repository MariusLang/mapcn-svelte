<script lang="ts">
	import Moon from "@lucide/svelte/icons/moon";
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
	const failedAvatars = $state<Record<string, boolean>>({});
	let memberList = $state<HTMLUListElement>();
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

	$effect(() => {
		const row =
			selected && memberList?.querySelector<HTMLButtonElement>(`[data-member="${selected.id}"]`);
		if (!memberList || !row) return;
		const list = memberList.getBoundingClientRect();
		const button = row.getBoundingClientRect();
		if (button.top < list.top) memberList.scrollTop += button.top - list.top;
		else if (button.bottom > list.bottom) memberList.scrollTop += button.bottom - list.bottom;
	});

	function selectGroup(group: MemberGroup) {
		const currentZoom = map?.getZoom() ?? mapView.maxZoom;
		if (!map || group.members.length === 1 || currentZoom >= mapView.maxZoom) {
			select(group.members[0]);
			return;
		}
		map.flyTo({ center: [group.lng, group.lat], zoom: Math.min(currentZoom + 2, mapView.maxZoom) });
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

{#snippet avatar(member: Member, marker = false)}
	<span
		class={[
			"bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-medium",
			!member.awake && "opacity-70",
			marker && "ring-background size-9 shadow-md ring-2",
		]}
	>
		{#if failedAvatars[member.id]}
			{member.name
				.split(" ")
				.slice(0, 2)
				.map((part) => part[0])
				.join("")}
		{:else}
			<img
				src={getAvatarUrl(member.id)}
				alt=""
				draggable={false}
				onerror={() => (failedAvatars[member.id] = true)}
				class="size-full object-cover"
			/>
		{/if}
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
		<ul bind:this={memberList} class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
			{#each visibleMembers as member (member.id)}
				<li>
					<button
						type="button"
						data-member={member.id}
						aria-pressed={selected?.id === member.id}
						onclick={() => select(member)}
						class="hover:bg-muted aria-pressed:bg-muted flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left"
					>
						{@render avatar(member)}
						<span class="min-w-0 flex-1">
							<span class="block truncate text-xs font-medium">{member.name}</span>
							<span class="text-muted-foreground block truncate text-[11px]">{member.city}</span>
						</span>
						<span
							class="text-muted-foreground flex shrink-0 items-center gap-1.5 text-[11px] tabular-nums"
							>{#if !member.awake}<Moon class="size-2.5" />{/if}{member.localTime}</span
						>
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
				{@const member = group.members[0]}
				<MapMarker longitude={group.lng} latitude={group.lat} opacityWhenCovered="0">
					<MarkerContent>
						<button
							type="button"
							aria-label={group.members.length > 1
								? `${member.name} and ${group.members.length - 1} more`
								: member.name}
							onclick={() => selectGroup(group)}
							class="relative transition-transform hover:scale-110"
						>
							{@render avatar(member, true)}
							{#if group.members.length > 1}
								<span
									class="bg-foreground text-background ring-background absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full text-[10px] font-medium ring-2"
									>{group.members.length}</span
								>
							{:else if !member.awake}
								<span
									class="bg-background text-muted-foreground absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full"
									><Moon class="size-2.5 fill-current" /></span
								>
							{/if}
						</button>
					</MarkerContent>
					{#if group.members.length > 1 || member.id !== selectedId}
						<MarkerTooltip
							offset={26}
							class="bg-popover text-popover-foreground min-w-36 border p-2"
						>
							<ul class="space-y-1.5">
								{#each group.members as item (item.id)}
									<li class="text-[11px]">
										<div class="flex items-center justify-between gap-3">
											<span class="font-medium">{item.name}</span>{#if !item.awake}<Moon
													class="text-muted-foreground size-2.5"
												/>{/if}
										</div>
										<div
											class="text-muted-foreground mt-0.5 flex items-center justify-between gap-3"
										>
											<span>{item.city}</span><span class="tabular-nums">{item.localTime}</span>
										</div>
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
