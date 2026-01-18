# Unimplemented Props

This document lists props from MapLibre GL JS API that are not directly exposed as top-level props in mapcn-svelte components.

## Map

All MapLibre `MapOptions` are available through the `options` prop. The following options cannot be used as direct props and must be passed via `options`:

- `container` (handled internally)
- `style` (handled internally via `styles` prop)
- All other `MapOptions` are available via the `options` prop

Example:

```svelte
<Map
  center={[13.405, 52.52]}
  zoom={12}
  styles={{ light: "custom-style.json", dark: "custom-dark-style.json" }}
  options={{
    bearing: 0,
    pitch: 0,
    minZoom: 0,
    maxZoom: 22,
    // ... any other MapLibre MapOptions
  }}
>
```

## MapControls

All documented props are implemented. No unimplemented props.

## MapRoute

All documented props are implemented. No unimplemented props.

## MapClusterLayer

All documented props are implemented. No unimplemented props.

## MapMarker

All documented props are implemented. No unimplemented props.

## MapPopup

All documented props are implemented. No unimplemented props.

## MarkerContent

All documented props are implemented. No unimplemented props.

## MarkerLabel

All documented props are implemented. No unimplemented props.

## MarkerPopup

All documented props are implemented. No unimplemented props.

## MarkerTooltip

All documented props are implemented. No unimplemented props.
