---
name: build-optimization
description: Vite/Webpack config tuning with tree shaking, code splitting, dynamic imports, Brotli/gzip compression, and source maps
version: 1.0.0
status: production
owner: Javier Montaño
tags: [devops, build, vite, webpack, tree-shaking, code-splitting, compression]
---

# 095 — Build Optimization {DevOps}

## Purpose
Optimize the build pipeline to produce the smallest, fastest-loading bundles possible. Configure tree shaking, code splitting, compression, and source maps for production deployments.

## Physics — 3 Immutable Laws

1. **Law of Minimal Payload**: Every byte shipped to the browser must justify its existence. Unused code is eliminated. Large dependencies are lazy-loaded.
2. **Law of Parallel Loading**: Code splitting enables parallel chunk downloads. Route-based splitting ensures users only load code for the current page.
3. **Law of Compression**: All production assets are Brotli-compressed (preferred) or gzip-compressed. Uncompressed production deploys are a bug.

## Protocol

### Phase 1 — Bundler Configuration
1. Vite: configure `vite.config.ts` with `build.rollupOptions.output.manualChunks` for vendor splitting.
2. Webpack: configure `optimization.splitChunks` with `cacheGroups` for vendor/common/async chunks.
3. Enable tree shaking: ensure `"sideEffects": false` in `package.json` for all pure modules.
4. Set `build.target: 'es2020'` — no unnecessary transpilation for modern browsers.

### Phase 2 — Code Splitting Strategy
1. Route-based splitting: `React.lazy(() => import('./pages/Dashboard'))` for each route.
2. Feature-based splitting: heavy features (charts, editors) loaded on demand.
3. Vendor splitting: separate chunks for `react`, `firebase`, `lodash-es`.
4. Shared chunk: common utilities used by 3+ routes go into shared chunk.

### Phase 3 — Compression & Source Maps
1. Install `vite-plugin-compression` or `compression-webpack-plugin`.
2. Generate Brotli (`.br`) and gzip (`.gz`) for all assets > 1KB.
3. Firebase Hosting auto-compresses, but pre-compressed assets are faster.
4. Source maps: `hidden-source-map` for production — uploaded to error tracker, not served to users.

## I/O

| Input | Output |
|-------|--------|
| Application source code | Optimized production bundle |
| Vite/Webpack config | Split chunks (vendor, routes, shared) |
| Built assets | Brotli/gzip compressed files |
| Source maps config | Hidden source maps for error tracking |

## Quality Gates — 5 Checks

1. **Initial bundle < 250KB gzipped** — measured by `size-limit`.
2. **No single chunk > 100KB gzipped** — split further if exceeding.
3. **Tree shaking verified** — `import { specific }` not `import *` for all dependencies.
4. **Brotli compression enabled** — verify `.br` files in build output.
5. **No source maps in production CDN** — `hidden-source-map` mode only.

## Edge Cases

- **Firebase SDK size**: Firebase modular SDK (`firebase/firestore/lite`) reduces bundle by ~60%.
- **Dynamic import failures**: Add error boundary around `React.lazy` with retry logic.
- **CSS extraction**: Use `mini-css-extract-plugin` or Vite's built-in CSS splitting.
- **Polyfills**: Only include polyfills for features actually used. Use `@vitejs/plugin-legacy` only if supporting IE11.

## Self-Correction Triggers

- Bundle exceeds 250KB → run bundle analyzer (skill 099), identify and split large deps.
- Chunk exceeds 100KB → add manual chunk splitting or dynamic import.
- Tree shaking not working → check `sideEffects` field, verify ESM imports.
- Build time exceeds 60s → enable caching (`vite` default), use `esbuild` for transpilation.
