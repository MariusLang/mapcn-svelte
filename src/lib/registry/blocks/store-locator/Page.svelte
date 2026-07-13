<script lang="ts">
	import * as Sidebar from "$lib/registry/ui/sidebar";
	import StoreList from "./StoreList.svelte";
	import LocatorMap from "./LocatorMap.svelte";
	import { MAP_CENTER, stores } from "./data";

	let query = $state("");
	let selectedId = $state<string | null>(stores[0].id);

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return stores;
		return stores.filter(
			(store) =>
				store.name.toLowerCase().includes(q) ||
				store.address.toLowerCase().includes(q) ||
				store.neighborhood.toLowerCase().includes(q)
		);
	});
</script>

<Sidebar.Provider style="--sidebar-width: 20rem">
	<StoreList stores={filtered} bind:query {selectedId} onselect={(id) => (selectedId = id)} />

	<Sidebar.Inset>
		<LocatorMap
			stores={filtered}
			{selectedId}
			onselect={(id) => (selectedId = id)}
			onclearselection={() => (selectedId = null)}
			center={MAP_CENTER}
		/>
	</Sidebar.Inset>
</Sidebar.Provider>
