import { onDestroy } from "svelte";
import { browser } from "$app/environment";

export interface TocItem {
	title: string;
	slug: string;
}

export function useActiveItem(getItems: () => TocItem[]) {
	let activeId = $state<string | null>(null);
	let observer: IntersectionObserver | null = null;

	function setupObserver(currentItems: TocItem[]) {
		if (!browser) return;

		// Clean up previous observer
		if (observer) {
			observer.disconnect();
			observer = null;
		}

		const itemIds = currentItems?.map((item) => item.slug) ?? [];
		if (itemIds.length === 0) return;

		const newObserver = new IntersectionObserver(
			(entries) => {
				// Get all visible entries that are intersecting
				const visibleEntries = entries.filter((entry) => entry.isIntersecting);

				if (visibleEntries.length > 0) {
					// Find the topmost visible entry
					let topmost = visibleEntries[0];
					for (const entry of visibleEntries) {
						if (entry.boundingClientRect.top < topmost.boundingClientRect.top) {
							topmost = entry;
						}
					}
					activeId = topmost.target.id;
				}
			},
			{ threshold: [0], rootMargin: "0px 0px 0% 0px" }
		);

		for (const id of itemIds) {
			const element = document.getElementById(id);
			if (element) {
				newObserver.observe(element);
			}
		}

		observer = newObserver;
	}

	// Watch for changes to items and set up observer
	$effect(() => {
		const items = getItems();
		setupObserver(items);

		return () => {
			if (observer) {
				observer.disconnect();
				observer = null;
			}
		};
	});

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});

	return {
		get activeId() {
			return activeId;
		},
	};
}
