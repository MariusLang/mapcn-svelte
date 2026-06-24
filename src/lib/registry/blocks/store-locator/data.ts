export interface Store {
	id: string;
	name: string;
	address: string;
	neighborhood: string;
	phone: string;
	hours: string;
	openNow: boolean;
	lat: number;
	lng: number;
}

export const MAP_CENTER: [number, number] = [-122.4194, 37.7749];

export const stores: Store[] = [
	{
		id: "ferry-building",
		name: "Ferry Building",
		address: "1 Ferry Building",
		neighborhood: "Embarcadero",
		phone: "(415) 555-0142",
		hours: "7:00 AM - 8:00 PM",
		openNow: true,
		lat: 37.7955,
		lng: -122.3933,
	},
	{
		id: "union-square",
		name: "Union Square",
		address: "333 Post St",
		neighborhood: "Downtown",
		phone: "(415) 555-0188",
		hours: "6:30 AM - 9:00 PM",
		openNow: true,
		lat: 37.788,
		lng: -122.4075,
	},
	{
		id: "north-beach",
		name: "North Beach",
		address: "601 Columbus Ave",
		neighborhood: "North Beach",
		phone: "(415) 555-0119",
		hours: "7:00 AM - 7:00 PM",
		openNow: true,
		lat: 37.8003,
		lng: -122.4097,
	},
	{
		id: "hayes-valley",
		name: "Hayes Valley",
		address: "450 Hayes St",
		neighborhood: "Hayes Valley",
		phone: "(415) 555-0163",
		hours: "7:30 AM - 6:00 PM",
		openNow: false,
		lat: 37.7765,
		lng: -122.4256,
	},
	{
		id: "mission",
		name: "Mission District",
		address: "2901 Mission St",
		neighborhood: "Mission",
		phone: "(415) 555-0177",
		hours: "6:00 AM - 8:00 PM",
		openNow: true,
		lat: 37.7509,
		lng: -122.4181,
	},
	{
		id: "marina",
		name: "Marina",
		address: "2156 Chestnut St",
		neighborhood: "Marina",
		phone: "(415) 555-0125",
		hours: "7:00 AM - 7:00 PM",
		openNow: false,
		lat: 37.8003,
		lng: -122.4366,
	},
	{
		id: "castro",
		name: "Castro",
		address: "489 Castro St",
		neighborhood: "Castro",
		phone: "(415) 555-0151",
		hours: "7:00 AM - 8:00 PM",
		openNow: true,
		lat: 37.7609,
		lng: -122.435,
	},
	{
		id: "soma",
		name: "SoMa",
		address: "680 Folsom St",
		neighborhood: "SoMa",
		phone: "(415) 555-0134",
		hours: "6:30 AM - 6:30 PM",
		openNow: true,
		lat: 37.7852,
		lng: -122.3982,
	},
];
