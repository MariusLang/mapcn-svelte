export const WORLD_GEOJSON =
	"https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";

export interface WorldFeatureProperties {
	NAME_LONG: string;
}

export type WorldData = GeoJSON.FeatureCollection<GeoJSON.Geometry, WorldFeatureProperties>;

export function useWorldData(url: string = WORLD_GEOJSON) {
	let data = $state<WorldData | null>(null);

	$effect(() => {
		let active = true;

		fetch(url)
			.then((res) => res.json() as Promise<WorldData>)
			.then((world) => {
				if (active) data = world;
			});

		return () => {
			active = false;
		};
	});

	return {
		get data() {
			return data;
		},
	};
}
