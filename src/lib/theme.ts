import { writable } from "svelte/store";
import { browser } from "$app/environment";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
	if (!browser) return "light";

	const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
	if (stored === "light" || stored === "dark") return stored;

	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const theme = writable<Theme>(getInitialTheme());

theme.subscribe((value) => {
	if (!browser) return;

	localStorage.setItem(STORAGE_KEY, value);

	const root = document.documentElement;
	root.classList.toggle("dark", value === "dark");
	root.classList.toggle("light", value === "light");
});
