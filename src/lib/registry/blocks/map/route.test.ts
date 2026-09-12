import { describe, expect, it } from "vitest";
import {
	clampFraction,
	measureRoute,
	pointAtFraction,
	sliceAtFraction,
	resolveBeforeId,
	createRouteRaiser,
	type Coordinates,
} from "./route.js";
import type { Map } from "maplibre-gl";

describe("route geometry", () => {
	const route: Coordinates = [
		[0, 0],
		[1, 0],
		[4, 0],
	];
	const measure = measureRoute(route);
	it("measures distance rather than counting vertices", () => {
		expect(measure).toEqual({ cumulative: [0, 1, 4], total: 4 });
		expect(pointAtFraction(route, measure, 0.5)).toEqual([2, 0]);
		expect(sliceAtFraction(route, measure, 0.5)).toEqual([
			[0, 0],
			[1, 0],
			[2, 0],
		]);
		expect(route).toHaveLength(3);
	});
	it("scales longitude distance by latitude", () => {
		expect(
			measureRoute([
				[0, 60],
				[2, 60],
			]).total
		).toBeCloseTo(1);
	});
	it.each([-1, 0, NaN, Infinity, -Infinity])("handles zero or invalid progress %s", (value) => {
		expect(clampFraction(value)).toBe(0);
		expect(pointAtFraction(route, measure, value)).toEqual(route[0]);
		expect(sliceAtFraction(route, measure, value)).toEqual([]);
	});
	it("clamps full progress and resolves exact vertices", () => {
		expect(pointAtFraction(route, measure, 2)).toEqual([4, 0]);
		expect(sliceAtFraction(route, measure, 2)).toEqual(route);
		expect(sliceAtFraction(route, measure, 0.25)).toEqual([
			[0, 0],
			[1, 0],
		]);
	});
	it.for<Coordinates>([
		[],
		[[1, 2]],
		[
			[1, 2],
			[1, 2],
		],
	])("handles degenerate routes %#", (coordinates) => {
		const measure = measureRoute(coordinates);
		expect(measure.total).toBe(0);
		expect(pointAtFraction(coordinates, measure, 0.5)).toEqual(coordinates[0] ?? null);
		expect(sliceAtFraction(coordinates, measure, 0.5)).toEqual([]);
	});
	it("handles repeated vertices without dividing by zero", () => {
		const points: Coordinates = [
			[0, 0],
			[0, 0],
			[4, 0],
			[4, 0],
		];
		expect(pointAtFraction(points, measureRoute(points), 0.5)).toEqual([2, 0]);
		expect(pointAtFraction(points, measureRoute(points), 1)).toEqual([4, 0]);
	});
	it("ignores a beforeId absent from the current basemap", () => {
		const map = { getLayer: (id: string) => (id === "labels" ? {} : undefined) } as Map;
		expect(resolveBeforeId(map, "labels")).toBe("labels");
		expect(resolveBeforeId(map, "missing")).toBeUndefined();
		expect(resolveBeforeId(map, undefined)).toBeUndefined();
	});
});

describe("active route stacking", () => {
	function fixture(initial: string[]) {
		let order = [...initial];
		let moves = 0;
		const listeners: (() => void)[] = [];
		const emit = () => listeners.forEach((listener) => listener());
		const map = {
			getLayersOrder: () => [...order],
			getLayer: (id: string) => (order.includes(id) ? {} : undefined),
			moveLayer(id: string, before?: string) {
				if (++moves > 30) throw new Error("Reordering loop");
				order = order.filter((entry) => entry !== id);
				order.splice(before ? order.indexOf(before) : order.length, 0, id);
				emit();
			},
		} as Map;
		return {
			map,
			listeners,
			emit,
			add(id: string) {
				order.push(id);
				emit();
			},
			get moves() {
				return moves;
			},
		};
	}
	it("raises the base and progress together, including after late alternatives mount", () => {
		const f = fixture(["base", "progress", "alternative"]);
		const raise = createRouteRaiser(f.map, () => ["base", "progress"]);
		f.listeners.push(raise);
		raise();
		expect(f.map.getLayersOrder()).toEqual(["alternative", "base", "progress"]);
		f.add("late-alternative");
		expect(f.map.getLayersOrder()).toEqual(["alternative", "late-alternative", "base", "progress"]);
		f.emit();
		expect(f.moves).toBe(4);
	});
	it("keeps the whole route below its boundary", () => {
		const f = fixture(["base", "progress", "alternative", "labels"]);
		createRouteRaiser(f.map, () => ["base", "progress"], "labels")();
		expect(f.map.getLayersOrder()).toEqual(["alternative", "base", "progress", "labels"]);
	});
	it("does not fight another active route on reorder events", () => {
		const f = fixture(["one", "two"]);
		const first = createRouteRaiser(f.map, () => ["one"]);
		const second = createRouteRaiser(f.map, () => ["two"]);
		first();
		second();
		f.listeners.push(first, second);
		f.add("late");
		expect(f.moves).toBeLessThanOrEqual(6);
		const moves = f.moves;
		f.emit();
		expect(f.moves).toBe(moves);
	});
});
