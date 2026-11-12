import { onDestroy } from "svelte";

export function useCopy(resetAfter = 2000) {
	let status = $state<"idle" | "copied" | "failed">("idle");
	let timer: ReturnType<typeof setTimeout>;
	let attempt = 0;

	onDestroy(() => {
		clearTimeout(timer);
		attempt++;
	});

	async function copy(text: string) {
		const current = ++attempt;
		clearTimeout(timer);
		let copied = false;
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
		} catch {
			// Display a failure status when clipboard access is unavailable.
		}
		if (current !== attempt) return false;
		status = copied ? "copied" : "failed";
		timer = setTimeout(() => (status = "idle"), resetAfter);
		return copied;
	}

	return {
		copy,
		get copied() {
			return status === "copied";
		},
		label(idle: string) {
			if (status === "idle") return idle;
			return status === "copied" ? "Copied" : "Couldn't copy";
		},
	};
}
