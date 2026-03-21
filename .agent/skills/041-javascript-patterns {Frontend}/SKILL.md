---
name: javascript-patterns
description: Modern JS patterns. ES modules, async/await, Web APIs (Intersection/Resize/Mutation Observer), event delegation, AbortController.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [frontend, javascript, patterns, web-apis]
---
# javascript-patterns {Frontend} (v1.0)
> **"Ship pixels that perform, accessible by default."**
## Purpose
Modern JS patterns. ES modules, async/await, Web APIs (Intersection/Resize/Mutation Observer), event delegation, AbortController.
**When to use:** Frontend development within the Firebase/Google/Hostinger stack.
## 1. The Physics
1. **Law of Semantics:** HTML first, CSS second, JS third. Semantic markup is non-negotiable.
2. **Law of Performance:** Lighthouse > 90. Lazy load images. Code-split routes. Critical CSS inline.
3. **Law of Accessibility:** WCAG 2.1 AA minimum. Keyboard navigable. Screen reader tested. ARIA where needed.
## 2. The Protocol
### Phase 1: Structure
1. Define page/component structure with semantic HTML5.
2. Apply design tokens from `.agent/.shared/design-tokens.md`.
3. Configure responsive breakpoints (mobile-first).
### Phase 2: Build
1. Implement with framework (React/Angular) or vanilla HTML/CSS/JS.
2. Integrate Firebase services (Auth, Firestore listeners, Storage).
3. Add loading/error states for async operations.
### Phase 3: Validate
1. Run Lighthouse audit (> 90 on all categories).
2. Run accessibility audit (axe-core).
3. Test on mobile, tablet, desktop breakpoints.
## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Requirements/spec | Text/File | Yes | What to build |
| Output | Type | Description |
|--------|------|-------------|
| Source files | HTML/CSS/JS/TSX | Production-ready code |
## 4. Quality Gates
- [ ] Semantic HTML5 structure
- [ ] Responsive on all breakpoints
- [ ] Lighthouse > 90
- [ ] WCAG 2.1 AA compliant
- [ ] Firebase integration working
## 5. Self-Correction Triggers
> [!WARNING]
> IF using div soup without semantic elements THEN refactor to semantic HTML5.
> IF Lighthouse < 90 THEN optimize before shipping.
