---
name: e2e-testing
description: Cypress/Playwright E2E testing with page object model, CI integration, and visual assertions
version: 1.0.0
status: production
owner: Javier Montaño
tags: [testing, e2e, cypress, playwright, page-object-model, ci, visual-assertions]
---

# 081 — E2E Testing {Testing}

## Purpose
Validate complete user journeys through the application using Cypress or Playwright. Ensure critical paths work end-to-end against a Firebase test environment with real UI interactions.

## Physics — 3 Immutable Laws

1. **Law of User Truth**: E2E tests simulate real user behavior — clicks, navigation, form fills. No direct API calls or DOM manipulation shortcuts.
2. **Law of Critical Path**: Only test critical user journeys (auth, CRUD, payments). E2E is expensive — unit/integration cover the rest.
3. **Law of Stability**: E2E tests use explicit waits, data-testid selectors, and retry logic. No `cy.wait(5000)` or fragile CSS selectors.

## Protocol

### Phase 1 — Framework Setup
1. Choose framework: Playwright (multi-browser, auto-wait) or Cypress (DX, component testing).
2. Configure `playwright.config.ts` or `cypress.config.ts` with base URL pointing to Firebase emulator hosting.
3. Create `e2e/pages/` directory with Page Object Model classes.
4. Set up test user seeding via Auth emulator API.

### Phase 2 — Test Authoring
1. Define Page Objects: `LoginPage`, `DashboardPage`, `SettingsPage` — encapsulate selectors and actions.
2. Write test scenarios as user stories: `should login and see dashboard`.
3. Use `data-testid` attributes exclusively for element selection.
4. Add visual assertions: screenshot comparison at key states.

### Phase 3 — CI Pipeline
1. Run against Firebase emulator hosting (`firebase emulators:start --only hosting,auth,firestore`).
2. Execute in headless mode: `npx playwright test` or `npx cypress run`.
3. Generate HTML report + video recordings for failures.
4. Upload artifacts to CI (GitHub Actions `actions/upload-artifact`).

## I/O

| Input | Output |
|-------|--------|
| User journey specification | E2E test file with Page Object usage |
| UI components with `data-testid` | Page Object Model class |
| Firebase test environment | Test execution against emulators |
| CI trigger | HTML report + failure videos + screenshots |

## Quality Gates — 5 Checks

1. **All critical paths covered** — login, CRUD, navigation, error states.
2. **Page Object Model enforced** — no raw selectors in test files.
3. **data-testid on all interactive elements** — no CSS/XPath selectors.
4. **CI passes 3 consecutive runs** — no flaky tests.
5. **Execution time < 5 minutes** — parallelize if exceeding.

## Edge Cases

- **Auth token expiration**: Seed long-lived tokens or refresh mid-test.
- **Network latency**: Use Playwright's `route.fulfill()` to mock slow endpoints.
- **Responsive testing**: Run suite at mobile (375px) and desktop (1280px) viewports.
- **File uploads**: Use Cypress `cy.fixture()` or Playwright `setInputFiles()`.

## Self-Correction Triggers

- Flaky test detected (fails 1/3 runs) → quarantine and fix within 24h.
- E2E suite exceeds 5 min → split into parallel shards.
- Page Object missing for new page → block PR until POM created.
- Visual regression > 0.1% pixel diff → review and update baseline or fix.
