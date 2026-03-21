---
name: bundle-analysis
description: webpack-bundle-analyzer/rollup-plugin-visualizer for chunk analysis, splitting strategy, dynamic imports, and tree shaking audit
version: 1.0.0
status: production
owner: Javier Montaño
tags: [performance, bundle, webpack, rollup, vite, code-splitting, tree-shaking]
---

# 099 — Bundle Analysis {Performance}

## Purpose
Visualize, analyze, and optimize JavaScript bundle composition. Identify oversized dependencies, eliminate dead code, and enforce chunk splitting strategies that minimize initial load time.

## Physics — 3 Immutable Laws

1. **Law of Visibility**: You cannot optimize what you cannot see. Bundle visualization is the first step — treemaps reveal what code actually ships to users.
2. **Law of Lazy Loading**: Code not needed for initial render must not be in the initial bundle. Dynamic imports split code at route and feature boundaries.
3. **Law of Dependency Awareness**: Every `npm install` has a bundle cost. The team must know the gzipped size of every dependency before adding it.

## Protocol

### Phase 1 — Visualization Setup
1. Vite: `rollup-plugin-visualizer` in `vite.config.ts` — generates `stats.html` treemap.
2. Webpack: `webpack-bundle-analyzer` plugin — opens interactive treemap on build.
3. Add npm script: `"analyze": "ANALYZE=true vite build"` or `"analyze": "webpack --profile --json > stats.json"`.
4. Run analysis on every release and after adding new dependencies.

### Phase 2 — Chunk Audit
1. Identify top 5 largest chunks by gzipped size.
2. For each large chunk: can it be lazy-loaded? Is tree shaking working? Is there a lighter alternative?
3. Check for duplicate dependencies (multiple versions of same package).
4. Verify vendor chunk contains only shared dependencies, not route-specific code.

### Phase 3 — Optimization Actions
1. Replace heavy dependencies: `moment` → `date-fns` or `dayjs`. `lodash` → `lodash-es` (tree-shakeable).
2. Dynamic import heavy features: `const Chart = lazy(() => import('chart.js'))`.
3. Configure `manualChunks` to isolate firebase, react, and other large vendors.
4. Verify tree shaking: check that unused exports don't appear in bundle.

## I/O

| Input | Output |
|-------|--------|
| Built application | Bundle treemap visualization (HTML) |
| `stats.json` / Rollup stats | Chunk-by-chunk size analysis |
| Dependency list | Size impact report per dependency |
| Optimization actions | Reduced bundle with before/after comparison |

## Quality Gates — 5 Checks

1. **Initial JS bundle < 250KB gzipped** — total of all eagerly loaded chunks.
2. **No single dependency > 50KB gzipped** without documented justification.
3. **Zero duplicate packages** — `npm dedupe` resolves all duplicates.
4. **Tree shaking verified** — unused named exports absent from output.
5. **Bundle analysis run on every release** — treemap reviewed before deploy.

## Edge Cases

- **Firebase SDK**: Use modular imports (`firebase/firestore/lite`) — tree shaking only works with ESM.
- **CSS-in-JS**: Libraries like `styled-components` add to JS bundle. Measure and account for it.
- **Source maps**: Exclude from size measurements — they don't ship to users.
- **Polyfills**: Measure separately. Consider differential serving (modern + legacy bundles).

## Self-Correction Triggers

- Bundle exceeds 250KB → immediately run analysis, identify top offenders.
- New dependency adds > 50KB → find lighter alternative or lazy-load.
- Duplicate dependency detected → run `npm dedupe`, update lock file.
- Tree shaking broken → check `sideEffects` in `package.json`, verify ESM imports.
