---
name: accessibility-audit
description: WCAG 2.1 AA automated scanning with axe-core plus manual checklist for keyboard, screen reader, and contrast
version: 1.0.0
status: production
owner: Javier Montaño
tags: [testing, accessibility, wcag, axe-core, a11y, screen-reader, keyboard-nav]
---

# 082 — Accessibility Audit {Testing}

## Purpose
Enforce WCAG 2.1 AA compliance through automated axe-core scanning and structured manual testing. Every UI component must be usable by keyboard, screen reader, and users with visual impairments.

## Physics — 3 Immutable Laws

1. **Law of Universal Access**: If a sighted mouse user can do it, a keyboard-only or screen reader user must also be able to do it. No exceptions.
2. **Law of Automated First**: axe-core catches ~57% of WCAG issues automatically. Run it first, then manually verify the remaining 43%.
3. **Law of Continuous Compliance**: Accessibility is not a one-time audit. Every PR must pass a11y checks. Regressions are bugs.

## Protocol

### Phase 1 — Automated Scanning
1. Install `@axe-core/react` (dev) or `axe-playwright`/`cypress-axe` for E2E.
2. Add axe check to every component test: `expect(await axe(container)).toHaveNoViolations()`.
3. Configure CI to run `axe-core` on all routes via Playwright crawl.
4. Generate JSON + HTML violation report.

### Phase 2 — Manual Checklist
1. **Keyboard navigation**: Tab through all interactive elements. Verify focus order is logical. Ensure focus is visible.
2. **Screen reader**: Test with VoiceOver (macOS) or NVDA (Windows). Verify aria-labels, live regions, landmarks.
3. **Color contrast**: Verify 4.5:1 ratio for text, 3:1 for large text. Use Chrome DevTools contrast checker.
4. **Motion/animation**: Verify `prefers-reduced-motion` is respected. No auto-playing animations without pause.

### Phase 3 — Remediation
1. Prioritize violations: Critical > Serious > Moderate > Minor.
2. Fix critical/serious in current sprint. Track moderate/minor in backlog.
3. Update component library with a11y-compliant variants.

## I/O

| Input | Output |
|-------|--------|
| React/HTML component | axe-core violation report (JSON/HTML) |
| Route list | Full-site automated scan results |
| Manual audit checklist | Completed checklist with pass/fail per criterion |
| Violation report | Remediation tickets with WCAG reference |

## Quality Gates — 5 Checks

1. **Zero critical/serious axe violations** in CI — merge blocked on failure.
2. **All interactive elements keyboard-reachable** — manual verification per page.
3. **Color contrast ratio >= 4.5:1** for all body text.
4. **ARIA landmarks present** — `main`, `nav`, `banner`, `contentinfo` on every page.
5. **Form inputs have visible labels** — no placeholder-only fields.

## Edge Cases

- **Dynamic content**: Use `aria-live="polite"` for async updates (toasts, loaders).
- **Modals**: Trap focus inside modal. Return focus to trigger on close.
- **Custom components**: `<div>` buttons need `role="button"`, `tabindex="0"`, `onKeyDown` for Enter/Space.
- **SVG icons**: Add `aria-hidden="true"` for decorative. `role="img"` + `aria-label` for meaningful.

## Self-Correction Triggers

- axe violation count increases between releases → block deploy, remediate.
- Screen reader test skipped → flag in PR review checklist.
- New component lacks a11y test → component review blocks approval.
- Contrast check fails on new theme → update design tokens before merge.
