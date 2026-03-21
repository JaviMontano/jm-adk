---
name: unit-testing
description: Jest/Vitest unit testing with Firebase emulator mocking, TDD workflow, and 80%+ coverage enforcement
version: 1.0.0
status: production
owner: Javier Montaño
tags: [testing, jest, vitest, firebase, tdd, coverage, mocking]
---

# 079 — Unit Testing {Testing}

## Purpose
Establish deterministic, fast-feedback unit test infrastructure using Jest or Vitest with Firebase service mocking. Enforce TDD red-green-refactor cycles and maintain coverage above 80% on all modules.

## Physics — 3 Immutable Laws

1. **Law of Isolation**: Every unit test runs in complete isolation — no network, no Firestore, no real Auth. All Firebase services are mocked or emulated.
2. **Law of Speed**: The full unit suite executes in under 60 seconds. Any test exceeding 5s is a smell — refactor the dependency.
3. **Law of Determinism**: Same input always produces same output. No date-dependent, random, or order-dependent tests. Flaky = deleted.

## Protocol

### Phase 1 — Setup
1. Select runner: Vitest (Vite projects) or Jest (legacy/CRA).
2. Configure `vitest.config.ts` or `jest.config.ts` with `@testing-library/*` and Firebase mock paths.
3. Create `__mocks__/firebase/` with stubs for `auth`, `firestore`, `functions`, `storage`.
4. Set coverage thresholds in config: `{ branches: 80, functions: 80, lines: 80, statements: 80 }`.

### Phase 2 — TDD Execution
1. Write failing test (RED) — assert expected behavior before implementation.
2. Write minimal code to pass (GREEN) — no gold-plating.
3. Refactor — extract, rename, simplify while tests stay green.
4. Run `vitest --coverage` or `jest --coverage` after each cycle.

### Phase 3 — CI Gate
1. Add test command to `package.json`: `"test:unit": "vitest run --coverage"`.
2. Fail CI if coverage drops below thresholds.
3. Generate coverage report artifact (lcov + HTML).

## I/O

| Input | Output |
|-------|--------|
| Source module (`.ts`/`.tsx`) | `*.test.ts` file with 3+ test cases per function |
| Firebase service dependency | Mock file in `__mocks__/firebase/` |
| Coverage config | `coverage/` report (lcov, HTML) |
| CI pipeline trigger | Pass/fail with coverage delta |

## Quality Gates — 5 Checks

1. **Coverage >= 80%** on lines, branches, functions, statements.
2. **Zero flaky tests** — run suite 3x in CI, all must pass.
3. **No `any` in test files** — TypeScript strict mode applies to tests.
4. **Each test has exactly one assertion concept** — no multi-concern tests.
5. **Mock accuracy** — mocks mirror real Firebase SDK signatures (type-checked).

## Edge Cases

- **Firestore Timestamps**: Mock `Timestamp.now()` with fixed value via `vi.useFakeTimers()`.
- **Auth state changes**: Use `onAuthStateChanged` mock that emits controlled sequences.
- **Cloud Functions callable**: Mock `httpsCallable` return with typed response objects.
- **Environment variables**: Use `vi.stubEnv()` — never read real `.env` in tests.

## Self-Correction Triggers

- Coverage drops below 80% → block merge, notify author.
- Test execution time exceeds 60s → profile and split slow suites.
- Snapshot tests exceed 20% of suite → convert to explicit assertions.
- Mock drift detected (SDK update) → regenerate mocks from SDK types.
