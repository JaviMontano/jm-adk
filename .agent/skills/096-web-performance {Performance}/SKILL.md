---
name: web-performance
description: Core Web Vitals optimization: LCP < 2.5s, INP < 200ms, CLS < 0.1. Lighthouse CI. Performance budgets. Critical CSS.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [performance, web-vitals, lcp, inp, cls, lighthouse]
---
# web-performance (v1.0)
> **"Measure, optimize, document. In that order."**
## Purpose
Core Web Vitals optimization: LCP < 2.5s, INP < 200ms, CLS < 0.1. Lighthouse CI. Performance budgets. Critical CSS.
**When to use:** Performance optimization, SEO, or documentation within Firebase/Hostinger projects.
## 1. The Physics
1. **Law of Measurement:** Measure before optimizing. Lighthouse, bundle analysis, Firestore usage.
2. **Law of Budgets:** Set performance budgets. Alert when exceeded.
3. **Law of Documentation:** Code without docs is a liability. README, API docs, runbooks mandatory.
## 2. The Protocol
### Phase 1: Measure current state (Lighthouse, bundle size, Firestore reads).
### Phase 2: Identify optimization targets.
### Phase 3: Implement optimizations. Document results and procedures.
## 3. Quality Gates
- [ ] Lighthouse > 90 on all categories
- [ ] Bundle size within budget
- [ ] Documentation complete (README, API docs)
- [ ] Firestore costs within projections
- [ ] SEO basics implemented (structured data, sitemap, OG tags)
