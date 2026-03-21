---
name: visual-regression-testing
description: Percy/Chromatic visual regression with screenshot comparison, component visual tests, and responsive breakpoints
version: 1.0.0
status: production
owner: Javier Montaño
tags: [testing, visual-regression, percy, chromatic, screenshot, responsive, storybook]
---

# 086 — Visual Regression Testing {Testing}

## Purpose
Detect unintended visual changes by comparing screenshots against approved baselines. Catch CSS regressions, layout shifts, and responsive breakpoint failures before they reach production.

## Physics — 3 Immutable Laws

1. **Law of Pixel Truth**: The rendered pixel output is the final source of truth. Code review cannot catch all visual regressions — screenshots can.
2. **Law of Approved Baselines**: Every visual test has an approved baseline image. Changes require explicit human approval — never auto-approve.
3. **Law of Viewport Coverage**: Test at minimum 3 breakpoints: mobile (375px), tablet (768px), desktop (1280px). Responsive bugs hide between breakpoints.

## Protocol

### Phase 1 — Tool Setup
1. Choose platform: Chromatic (Storybook integration) or Percy (framework-agnostic).
2. For Chromatic: `npx chromatic --project-token=<token>` in CI.
3. For Percy: `@percy/cli` + `@percy/playwright` or `@percy/cypress`.
4. Configure viewports: `[375, 768, 1280]` widths.

### Phase 2 — Test Authoring
1. **Component-level**: Capture every Storybook story variant (default, hover, active, disabled, error).
2. **Page-level**: Capture critical pages at each breakpoint after data loads.
3. **Interaction states**: Screenshot after modal open, dropdown expand, form validation.
4. Set diff threshold: 0.1% pixel difference triggers review.

### Phase 3 — Review Workflow
1. CI posts visual diff link to PR.
2. Reviewer approves or rejects each changed snapshot.
3. Approved snapshots become new baselines.
4. Rejected snapshots require code fix and re-run.

## I/O

| Input | Output |
|-------|--------|
| Storybook stories / page routes | Baseline screenshot set |
| Code change (PR) | Visual diff report with before/after |
| Reviewer approval | Updated baseline images |
| Viewport config | Multi-breakpoint screenshots |

## Quality Gates — 5 Checks

1. **All component stories have visual snapshots** — new component = new snapshot.
2. **3 viewport widths minimum** per visual test.
3. **Diff threshold <= 0.1%** — anything above requires review.
4. **No auto-approved changes** — human reviews every visual diff.
5. **CI blocks merge on unreviewed visual changes**.

## Edge Cases

- **Animation/transition**: Disable CSS animations in test env (`* { animation: none !important; }`).
- **Dynamic content**: Use fixed seed data (skill 085) to eliminate data-driven diffs.
- **Font loading**: Wait for fonts via `document.fonts.ready` before screenshot.
- **Dark mode**: Capture both light and dark theme variants.

## Self-Correction Triggers

- Frequent false positives (>20% of diffs are noise) → increase threshold or stabilize test data.
- New component merged without visual test → block in review checklist.
- Baseline drift (100+ pending approvals) → dedicated baseline update session.
- Screenshot flakiness → check font loading, animation disabling, data seeding.
