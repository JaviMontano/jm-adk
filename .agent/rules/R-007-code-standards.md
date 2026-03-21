---
name: R-007-code-standards
version: 1.0.0
status: production
enforcement: mandatory
---

# R-007: Code Standards

> **"ES Modules. TypeScript. Firebase v9+. Semantic HTML. No exceptions."**

## Definition
All generated code follows these standards:

### JavaScript/TypeScript
- ES Modules: `import`/`export` — NEVER CommonJS `require`
- TypeScript preferred, JavaScript acceptable
- `strict` mode in tsconfig.json
- Async/await over raw Promises
- Named exports over default exports

### Firebase
- SDK v9+ modular imports: `import { getFirestore } from 'firebase/firestore'`
- NEVER legacy namespaced SDK: `firebase.firestore()`
- Admin SDK v12+: `import { getFirestore } from 'firebase-admin/firestore'`
- 2nd gen Cloud Functions: `import { onRequest } from 'firebase-functions/v2/https'`

### HTML/CSS
- Semantic HTML5: `<header>`, `<main>`, `<nav>`, `<article>`, `<section>`, `<footer>`
- CSS custom properties for theming: `var(--color-primary)`
- Mobile-first responsive: min-width media queries
- ARIA attributes for interactive elements
- `alt` text on all images

### Naming
- Files: `kebab-case.ts`
- Components: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- CSS classes: `kebab-case` (BEM: `block__element--modifier`)

## Enforcement
- code-review-checklist (skill 083) validates standards
- output-contract-enforcer (skill 008) checks naming conventions
