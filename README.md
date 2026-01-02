<div align="center">
  <h1>mapcn-svelte</h1>
  <p><strong>Beautiful maps, made simple.</strong></p>

  <p>
    Free & open source map components for Svelte. Zero config, one command setup.<br/>
    Built on <a href="https://maplibre.org/">MapLibre GL</a>, styled with <a href="https://tailwindcss.com/">Tailwind</a>, works seamlessly with <a href="https://www.shadcn-svelte.com/">shadcn-svelte</a>.
  </p>

  <p>
    <a href="https://mapcn-svelte.vercel.app">Get Started</a> •
    <a href="https://mapcn-svelte.vercel.app/docs/installation">Installation</a> •
    <a href="https://mapcn-svelte.vercel.app/docs/basic-map">Examples</a>
  </p>
</div>

---

## About

This is a **Svelte port** of [mapcn](https://github.com/AnmolSaini16/mapcn) by [Anmol](https://github.com/AnmolSaini16). The original React version provides beautiful, composable map components for React applications. This port brings the same developer experience to Svelte 5, maintaining feature parity while adapting to Svelte's reactive paradigms.

## Features

- 🎨 **Theme-aware** — Automatically adapts to light/dark mode
- 🎯 **Zero config** — Works out of the box with sensible defaults
- 📦 **shadcn-svelte compatible** — Uses the same patterns and styling conventions
- 🗺️ **MapLibre GL powered** — Full access to MapLibre's powerful mapping capabilities
- 🧩 **Composable** — Build complex map UIs with simple, declarative components
- 📍 **Markers & Popups** — Rich marker system with popups, tooltips, and labels
- 🛤️ **Routes** — Draw routes and paths on your maps
- 🎮 **Controls** — Zoom, compass, locate, and fullscreen controls
- ⚡ **Svelte 5** — Built with Svelte 5's runes for optimal reactivity

## Installation

```bash
npx shadcn-svelte@latest add https://mapcn-svelte.vercel.app/r/map.json
```

This will install `maplibre-gl` and add all map components to your project.

## Quick Start

```svelte
<script lang="ts">
	import { Map, MapControls } from "$lib/components/ui/map";
</script>

<div class="h-[400px] w-full">
	<Map center={[-74.006, 40.7128]} zoom={12}>
		<MapControls />
	</Map>
</div>
```

## Documentation

Full documentation is available at [mapcn-svelte.vercel.app/docs](https://mapcn-svelte.vercel.app/docs)

## Components

- `Map` — Root map container with theme support
- `MapMarker` — Place markers on the map
- `MarkerContent` — Custom marker visuals
- `MarkerPopup` — Click-triggered popups
- `MarkerTooltip` — Hover tooltips
- `MarkerLabel` — Positioned labels
- `MapPopup` — Standalone popups
- `MapControls` — UI controls (zoom, compass, locate, fullscreen)
- `MapRoute` — Draw routes and paths

## Credits

- Original React version: [mapcn](https://github.com/AnmolSaini16/mapcn) by [Anmol Saini](https://github.com/AnmolSaini16)
- Svelte port: [Marius Lang](https://github.com/MariusLang)
- Built with [MapLibre GL](https://maplibre.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Compatible with [shadcn-svelte](https://www.shadcn-svelte.com/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.
