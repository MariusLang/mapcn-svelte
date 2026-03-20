import { docsExampleLoader } from "$lib/docs-example-loader";

export const load = async () => {
	const [markersExample, popupExample, draggableMarkerExample] = await Promise.all([
		docsExampleLoader.single("MarkersExample"),
		docsExampleLoader.single("PopupExample"),
		docsExampleLoader.single("DraggableMarkerExample"),
	]);

	return {
		markersSource: markersExample.source,
		markersHighlighted: markersExample.highlighted,

		popupSource: popupExample.source,
		popupHighlighted: popupExample.highlighted,

		draggableMarkerSource: draggableMarkerExample.source,
		draggableMarkerHighlighted: draggableMarkerExample.highlighted,
	};
};
