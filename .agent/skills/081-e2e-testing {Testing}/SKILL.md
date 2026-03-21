---
name: e2e-testing
description: Cypress or Playwright E2E setup. Page object model. CI integration. Visual assertions. Firebase test environment.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [testing, e2e, cypress, playwright, ci]
---
# e2e-testing {Testing} (v1.0)
> **"Untested code is broken code you haven't discovered yet."**
## Purpose
Cypress or Playwright E2E setup. Page object model. CI integration. Visual assertions. Firebase test environment.
**When to use:** Quality assurance and testing within Firebase projects.
## 1. The Physics
1. **Law of Pyramid:** Unit > Integration > E2E. More unit tests, fewer E2E tests.
2. **Law of Emulators:** Test against Firebase Emulator Suite, not production.
3. **Law of Coverage:** Minimum 80% code coverage. 100% for security-critical paths.
## 2. The Protocol
### Phase 1: Set up test infrastructure (framework, emulators, CI).
### Phase 2: Write tests following the test pyramid.
### Phase 3: Run tests, measure coverage, remediate gaps.
## 3. Quality Gates
- [ ] Test framework configured (Jest/Vitest/Cypress/Playwright)
- [ ] Firebase Emulator Suite running for tests
- [ ] Coverage > 80%
- [ ] Tests pass in CI
- [ ] Accessibility audit clean (for UI tests)
