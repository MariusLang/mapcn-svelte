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
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeId = entry.target.id;
					}
				}
			},
			{ rootMargin: "0% 0% -80% 0%" }
		);

		for (const id of itemIds) {
			const element = document.getElementById(id);
			if (element) {
				newObserver.observe(element);
			}
		}

		observer = newObserver;
	}

	// Set up observer initially
	setupObserver(getItems());

	// Watch for changes to items
	$effect(() => {
		setupObserver(getItems());
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
