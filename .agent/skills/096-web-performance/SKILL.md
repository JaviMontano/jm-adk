---
name: web-performance
description: Core Web Vitals optimization (LCP, INP, CLS), Lighthouse CI, performance budgets, and critical CSS extraction
version: 1.0.0
status: production
owner: Javier Montaño
tags: [performance, core-web-vitals, lighthouse, lcp, inp, cls, critical-css]
---

# 096 — Web Performance {Performance}

## Purpose
Achieve and maintain excellent Core Web Vitals scores. Optimize Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift through systematic measurement and targeted fixes.

## Physics — 3 Immutable Laws

1. **Law of User Perception**: Performance is measured by what users experience — LCP < 2.5s, INP < 200ms, CLS < 0.1. Server metrics are secondary.
2. **Law of Critical Path**: The browser renders what's on the critical path. Anything not needed for first paint must be deferred, lazy-loaded, or eliminated.
3. **Law of Budgets**: Performance budgets are enforced in CI. No PR may regress a Core Web Vital without justification and compensating optimization.

## Protocol

### Phase 1 — Measurement Baseline
1. Run Lighthouse CI on all key pages: homepage, dashboard, listing, detail.
2. Record baseline CWV: LCP, INP (formerly FID), CLS for each page.
3. Set up Real User Monitoring (RUM) via `web-vitals` library reporting to analytics.
4. Configure Lighthouse CI budget file: `lighthouserc.js` with per-metric thresholds.

### Phase 2 — LCP Optimization
1. Preload hero image: `<link rel="preload" as="image" href="hero.webp">`.
2. Inline critical CSS: extract above-the-fold CSS via `critters` or `critical`.
3. Eliminate render-blocking resources: defer non-critical JS, async load fonts.
4. Server response time < 200ms: use Firebase Hosting CDN cache.

### Phase 3 — INP & CLS Optimization
1. INP: Break long tasks > 50ms. Use `requestIdleCallback` or `scheduler.yield()` for heavy computation.
2. INP: Debounce rapid input handlers. Use `startTransition` for non-urgent React updates.
3. CLS: Set explicit `width`/`height` on images and embeds.
4. CLS: Reserve space for async content (skeletons). No layout shifts after initial paint.

## I/O

| Input | Output |
|-------|--------|
| Page URL | Lighthouse report (Performance, CWV scores) |
| `lighthouserc.js` budget | CI pass/fail per metric |
| `web-vitals` library integration | RUM data in analytics |
| CSS source | Critical CSS extracted + inlined |

## Quality Gates — 5 Checks

1. **LCP < 2.5s** on p75 for all key pages.
2. **INP < 200ms** on p75 — no interaction takes longer.
3. **CLS < 0.1** — no unexpected layout shifts.
4. **Lighthouse Performance >= 90** in CI.
5. **Performance budget enforced** — CI fails on regression.

## Edge Cases

- **Third-party scripts**: Analytics, chat widgets degrade CWV. Load via `requestIdleCallback` or after `load` event.
- **Dynamic content**: Content from Firestore may shift layout. Use skeleton placeholders matching final dimensions.
- **Font loading**: Use `font-display: swap` + preload WOFF2. Avoid FOIT (flash of invisible text).
- **SPA navigation**: Measure soft navigation CWV separately from hard navigation.

## Self-Correction Triggers

- LCP regresses above 2.5s → audit critical path, check preload hints, verify CDN cache.
- CLS spikes → search for new dynamic content without reserved space.
- Lighthouse drops below 90 → run full audit, compare with previous report.
- RUM data diverges from lab data → investigate real-world network conditions.
