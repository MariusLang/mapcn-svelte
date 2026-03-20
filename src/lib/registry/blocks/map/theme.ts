export type MapTheme = "light" | "dark";

export function resolveMapTheme({
	explicitTheme,
	ambientTheme,
}: {
	explicitTheme?: MapTheme;
	ambientTheme: MapTheme;
}): MapTheme {
	return explicitTheme ?? ambientTheme;
}
