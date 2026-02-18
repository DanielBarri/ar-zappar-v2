# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Start dev server (runs on http://localhost:3000)
npm run build    # Production build
npm test         # Run tests
```

## Architecture

AR web app using **Zappar** (WebGL AR tracking), **React 19**, **Three.js**, and **Create React App** with **TypeScript**.

The bundler is Webpack (via `react-scripts`), configured through `react-app-rewired` and `config-overrides.js`. Vite was intentionally avoided — Zappar's dependency chain includes CJS-only packages that Vite cannot handle without extensive workarounds.

### Key files

- `src/App.tsx` — All AR logic; the entire application
- `src/index.tsx` — React entry point
- `src/index.css` — Global styles + placement UI button styles
- `config-overrides.js` — Webpack overrides: suppresses mediapipe source map warning, adds Node polyfill fallbacks (`fs`, `path`)

### AR Rendering Tree

```
App
└── ZapparCanvas
    ├── ZapparCamera
    ├── InstantTracker (controlled by placementMode state)
    │   ├── mesh (3D sphere, hotpink)
    │   └── directionalLight
    └── BrowserCompatibility
```

`placementMode` (`useState`) toggles whether the user can reposition the object. `InstantTracker` handles surface detection; when `placementMode` is false the object locks in place.

### Zappar + Three.js notes

- Use `sphereGeometry` not `sphereBufferGeometry` (deprecated since Three.js r125)
- `@zappar/zappar-react-three-fiber` wraps Three.js and exposes AR primitives as JSX components
- AR camera permissions and WebGL setup are handled inside `ZapparCamera` and `ZapparCanvas`
