---
name: quality-metrics
description: Code coverage, cyclomatic complexity, duplication, Lighthouse scores, bundle size, and Firestore read/write tracking
version: 1.0.0
status: production
owner: Javier Montaño
tags: [testing, metrics, coverage, complexity, lighthouse, bundle-size, firestore]
---

# 084 — Quality Metrics {Testing}

## Purpose
Define, collect, and enforce quantitative quality thresholds across the entire stack. Every metric has a target, a measurement tool, and a CI enforcement gate.

## Physics — 3 Immutable Laws

1. **Law of Measurement**: What is not measured degrades. Every quality dimension has a numeric target tracked over time.
2. **Law of Thresholds**: Metrics without enforced thresholds are vanity metrics. Every metric has a pass/fail gate in CI.
3. **Law of Trends**: Absolute values matter less than direction. A metric moving in the wrong direction for 3 consecutive sprints triggers intervention.

## Protocol

### Phase 1 — Metric Collection
1. **Code coverage**: `vitest --coverage` or `jest --coverage` → lcov report.
2. **Cyclomatic complexity**: `eslint-plugin-complexity` with max 15 per function.
3. **Duplication**: `jscpd` with threshold < 5% duplication.
4. **Lighthouse**: `lighthouse-ci` for Performance, Accessibility, Best Practices, SEO.
5. **Bundle size**: `size-limit` or `bundlesize` with per-route budgets.
6. **Firestore I/O**: Cloud Monitoring dashboard tracking read/write/delete counts per day.

### Phase 2 — Dashboard & Reporting
1. Aggregate metrics in CI summary (GitHub Actions job summary).
2. Track trends in spreadsheet or dashboard (weekly snapshot).
3. Flag regressions as PR comments via `danger.js` or custom action.

## I/O

| Input | Output |
|-------|--------|
| Source code | Coverage report (lcov, HTML) |
| ESLint config | Complexity report per function |
| Built bundle | Bundle size report (per-chunk) |
| Deployed URL | Lighthouse JSON + HTML report |
| Firebase project | Firestore read/write daily counts |

## Quality Gates — 5 Checks

1. **Coverage >= 80%** lines, branches, functions, statements.
2. **Cyclomatic complexity <= 15** per function — no exceptions.
3. **Code duplication < 5%** across codebase.
4. **Lighthouse scores**: Performance >= 90, Accessibility >= 95, Best Practices >= 90, SEO >= 90.
5. **Bundle size < 250KB** initial load (gzipped) — per-route budgets enforced.

## Edge Cases

- **Monorepo projects**: Measure metrics per package, not aggregate only.
- **Third-party code**: Exclude `node_modules` and generated files from duplication/complexity.
- **Lighthouse variance**: Run 3x and take median to reduce noise.
- **Firestore spikes**: Set billing alert at 50K reads/day. Investigate any 3x spike.

## Self-Correction Triggers

- Any metric below threshold for 2 consecutive PRs → block merge until fixed.
- Lighthouse performance drops below 80 → performance audit sprint (skill 096).
- Bundle size exceeds budget → run bundle analysis (skill 099).
- Firestore reads spike 3x → review queries, add caching (skill 100).
