---
name: integration-testing
description: Firebase Emulator Suite integration tests for Firestore rules, Cloud Functions, and Auth flows
version: 1.0.0
status: production
owner: Javier Montaño
tags: [testing, integration, firebase-emulator, firestore-rules, cloud-functions, auth]
---

# 080 — Integration Testing {Testing}

## Purpose
Validate cross-service interactions using Firebase Emulator Suite. Test Firestore security rules, Cloud Functions triggers, and Auth flows against real emulated backends — not mocks.

## Physics — 3 Immutable Laws

1. **Law of Real Contracts**: Integration tests use actual Firebase Emulator instances. No mocking Firestore or Auth at this layer — the emulator IS the contract.
2. **Law of Clean State**: Each test file starts with a fresh emulator state. `clearFirestore()` and `clearAuth()` run in `beforeEach`.
3. **Law of Boundary Testing**: Integration tests validate the seams — service-to-service, rule enforcement, trigger chains. Internal logic belongs in unit tests.

## Protocol

### Phase 1 — Emulator Bootstrap
1. Ensure `firebase.json` has emulator config (see skill 087).
2. Install `@firebase/rules-unit-testing` for Firestore rules tests.
3. Create `test/integration/` directory with setup file that connects to emulator ports.
4. Script: `firebase emulators:exec --only firestore,auth,functions "vitest run --config vitest.integration.config.ts"`.

### Phase 2 — Test Authoring
1. **Firestore Rules**: Test allow/deny for each collection with authenticated/unauthenticated contexts.
2. **Cloud Functions**: Trigger `onCreate`, `onUpdate`, `onDelete` via emulator writes. Assert side effects.
3. **Auth Flows**: Create test users via Auth emulator. Validate custom claims propagation.

### Phase 3 — Assertion & Reporting
1. Assert Firestore document states after function triggers complete.
2. Validate security rule denials throw `permission-denied`.
3. Export emulator coverage report: `http://localhost:8080/emulator/v1/projects/{id}:ruleCoverage`.

## I/O

| Input | Output |
|-------|--------|
| Firestore security rules (`firestore.rules`) | Rule coverage report (HTML) |
| Cloud Functions source | Trigger execution logs + assertion results |
| Auth flow definitions | User creation/deletion verification |
| `firebase.json` emulator config | Emulator boot + test execution |

## Quality Gates — 5 Checks

1. **100% Firestore rule coverage** — every rule path has allow AND deny test.
2. **Function triggers tested** — every `onCreate/onUpdate/onDelete` has integration test.
3. **Auth flows verified** — sign-up, sign-in, custom claims, token refresh tested.
4. **Emulator cleanup confirmed** — no state leaks between test files.
5. **CI execution** — `firebase emulators:exec` runs in pipeline with Java 11+.

## Edge Cases

- **Eventual consistency**: Cloud Function triggers are async — use polling or `waitForExpect`.
- **Batch writes in rules**: Test that batched writes fail atomically when one rule denies.
- **Custom claims timing**: Claims update requires token refresh — test with `getIdTokenResult(true)`.
- **Emulator port conflicts**: Use non-default ports in CI to avoid clashes.

## Self-Correction Triggers

- Firestore rule coverage below 100% → block deploy until all paths tested.
- Function trigger test missing → lint rule flags untested exports.
- Emulator fails to start → check Java version, port availability, `firebase.json` config.
- Test pollution detected (order-dependent failures) → enforce `beforeEach` cleanup.
