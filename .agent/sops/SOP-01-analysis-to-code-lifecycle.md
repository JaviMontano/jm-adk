# SOP-01: Analysis-to-Code Lifecycle

> Full pipeline from raw requirements to production deployment.
> Every project built with the kit follows this phased lifecycle.

---

## Overview

```
Phase 0 → 1 → 2 → 3 → 4 → 5 → [G1] → 6 → [G2] → 7 → 8 → 9 → 10 → [G3]
 Input  Stake  AS-IS Flow  Spec  Scen  Gate  Arch  Gate  Scaff  Dev  Test  Deploy Gate
```

---

## Phase 0: Input Analysis

**Objective**: Parse all input documents and produce a completeness scorecard.

**Activities**:
1. Collect all input artifacts (PDFs, spreadsheets, meeting notes, diagrams, emails).
2. Classify each artifact by type: requirement, constraint, reference, context.
3. Extract structured data: actors, processes, entities, rules, integrations.
4. Identify gaps — missing information, ambiguous requirements, contradictions.
5. Produce **Input Completeness Scorecard** with coverage percentages per domain.

**Output**: `input-analysis.md` with scorecard, gap list, and clarification questions.

---

## Phase 1: Stakeholder Mapping

**Objective**: Identify all stakeholders and map their influence and interest.

**Activities**:
1. List all stakeholders (sponsors, users, operators, regulators, integrators).
2. Classify by influence (high/medium/low) and interest (high/medium/low).
3. Map communication channels and decision authority.
4. Identify RACI for key decisions.

**Output**: `stakeholder-map.md` with influence/interest matrix and RACI table.

---

## Phase 2: AS-IS Assessment

**Objective**: Evaluate the current state, technical debt, and constraints.

**Activities**:
1. Document current systems, tools, and processes.
2. Identify technical debt and legacy dependencies.
3. Map data flows in the existing system.
4. List constraints: budget, timeline, regulatory, technical, organizational.
5. Assess team capabilities and skill gaps.

**Output**: `as-is-assessment.md` with current-state diagram and constraint catalog.

---

## Phase 3: Flow Mapping

**Objective**: Build DDD taxonomy and map end-to-end business flows.

**Activities**:
1. Define bounded contexts and ubiquitous language.
2. Identify aggregates, entities, value objects.
3. Map end-to-end business flows (happy path + exceptions).
4. Document integration points with external systems.
5. Define domain events and their propagation.

**Output**: `flow-mapping.md` with domain model, flow diagrams, and integration map.

---

## Phase 4: Functional Specification

**Objective**: Define modules, use cases, data models, and acceptance criteria.

**Activities**:
1. Decompose system into functional modules.
2. Write use cases with preconditions, main flow, alternate flows, postconditions.
3. Define data models (Firestore collections, document schemas).
4. Specify validation rules and business logic.
5. Write acceptance criteria in Given/When/Then format.
6. Define non-functional requirements (performance, security, accessibility).

**Output**: `functional-spec.md` with module breakdown, use case catalog, and data model.

---

## Phase 5: Scenario Analysis

**Objective**: Evaluate implementation options and feasibility.

**Activities**:
1. Identify 2-3 implementation approaches per major decision.
2. Evaluate each against criteria: complexity, cost, timeline, risk, maintainability.
3. Score and rank options.
4. Document trade-offs and recommendations.
5. Produce effort estimates in FTE-months.

**Output**: `scenario-analysis.md` with decision matrix and recommendations.

---

## Gate G1: Analysis Completeness

**Checklist**:
- [ ] All input documents parsed and scored
- [ ] Stakeholder map reviewed and approved
- [ ] AS-IS assessment complete with no unresolved unknowns
- [ ] All business flows mapped end-to-end
- [ ] Functional spec covers all identified use cases
- [ ] Acceptance criteria written for every use case
- [ ] Scenario analysis reviewed by stakeholders
- [ ] All clarification questions answered
- [ ] Evidence tags present on all claims

**Gate decision**: Proceed to architecture / Return to analysis / Escalate.

---

## Phase 6: Architecture Design

**Objective**: Design Firebase architecture, data model, and security rules.

**Activities**:
1. Define Firebase project structure (dev / staging / prod).
2. Design Firestore data model: collections, documents, subcollections, indexes.
3. Write Firestore security rules.
4. Design Cloud Functions: triggers, HTTP endpoints, scheduled tasks.
5. Define Auth configuration: providers, custom claims, MFA.
6. Plan Cloud Storage structure and security rules.
7. Design API contracts (callable functions, HTTP endpoints).
8. Plan caching strategy and offline behavior.
9. Define error handling and logging strategy.
10. Document deployment topology (Firebase Hosting + Hostinger).

**Output**: `architecture.md` with data model, security rules, function catalog, and deployment diagram.

---

## Gate G2: Architecture Approval

**Checklist**:
- [ ] Data model supports all use cases from functional spec
- [ ] Security rules enforce all access control requirements
- [ ] Cloud Functions cover all server-side logic needs
- [ ] Performance strategy addresses non-functional requirements
- [ ] Deployment topology documented and feasible
- [ ] Cost estimate within budget constraints
- [ ] Architecture reviewed by technical stakeholders

**Gate decision**: Proceed to scaffolding / Revise architecture / Escalate.

---

## Phase 7: Scaffolding

**Objective**: Generate project structure and configure Firebase.

**Activities**:
1. Initialize project repository with standard structure.
2. Run `firebase init` — configure selected services.
3. Set up Firestore indexes (`firestore.indexes.json`).
4. Write initial security rules (`firestore.rules`, `storage.rules`).
5. Configure `firebase.json` (hosting, functions, emulators).
6. Set up Firebase Emulator Suite configuration.
7. Install dependencies and configure build tools.
8. Create environment configuration files.
9. Set up linting, formatting, and pre-commit hooks.
10. Create CI/CD pipeline (GitHub Actions).

**Output**: Working project skeleton that builds, lints, and deploys to dev.

---

## Phase 8: Development

**Objective**: Build features iteratively following the functional spec.

**Activities**:
1. Prioritize features by business value and dependency order.
2. Implement features in vertical slices (UI + logic + data + functions).
3. Write unit tests alongside implementation.
4. Use Firebase Emulator Suite for local development.
5. Commit with conventional commit messages.
6. Deploy to dev/staging after each feature slice.
7. Conduct code reviews against 10x Standard.

**Cadence**: Feature slices of 1-3 days each.

---

## Phase 9: Testing

**Objective**: Validate quality across all dimensions.

**Activities**:
1. **Unit tests**: Functions, utilities, business logic (Vitest / Jest).
2. **Integration tests**: Firestore rules, Cloud Functions with emulators.
3. **E2E tests**: Critical user flows (Playwright / Cypress).
4. **Accessibility**: WCAG 2.1 AA compliance (axe-core, Lighthouse).
5. **Security**: Auth flow validation, rules testing, input sanitization.
6. **Performance**: Lighthouse scores > 90, Core Web Vitals within thresholds.
7. **Cross-browser**: Chrome, Firefox, Safari, Edge (latest 2 versions).
8. **Mobile**: Responsive layout validation on key breakpoints.

**Output**: Test report with coverage metrics and issue list.

---

## Phase 10: Deployment

**Objective**: Deploy to production on Firebase Hosting and/or Hostinger.

**Activities**:
1. Run production build and verify output.
2. Execute full test suite against production build.
3. Deploy Cloud Functions: `firebase deploy --only functions`.
4. Deploy Firestore rules: `firebase deploy --only firestore:rules`.
5. Deploy Storage rules: `firebase deploy --only storage`.
6. Deploy to Firebase Hosting: `firebase deploy --only hosting`.
7. Deploy static assets to Hostinger (if applicable) — see SOP-03.
8. Verify deployment: smoke tests, DNS, SSL, error tracking.
9. Enable monitoring: Crashlytics, Performance Monitoring, uptime checks.
10. Document deployment in release notes.

---

## Gate G3: Deployment Readiness

**Checklist**:
- [ ] All tests pass (unit, integration, E2E)
- [ ] Lighthouse scores > 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] No critical or high-severity bugs open
- [ ] Security rules reviewed and tested
- [ ] Monitoring and alerting configured
- [ ] Rollback procedure documented
- [ ] Release notes written
- [ ] Stakeholder sign-off received

**Gate decision**: Release to production / Fix issues / Rollback.

---

*Last updated: 2026-03-21*
