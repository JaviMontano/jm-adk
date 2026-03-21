---
name: test-data-factory
description: Firestore seed scripts, mock data generators, fixture files, and factory pattern for test entities
version: 1.0.0
status: production
owner: Javier Montaño
tags: [testing, test-data, factory, fixtures, seeding, firestore, mocking]
---

# 085 — Test Data Factory {Testing}

## Purpose
Provide consistent, type-safe, and reproducible test data across unit, integration, and E2E tests. Eliminate ad-hoc data creation in test files through centralized factory functions and Firestore seed scripts.

## Physics — 3 Immutable Laws

1. **Law of Single Source**: All test data originates from factory functions. No inline object literals in test files — every entity comes from a factory.
2. **Law of Type Safety**: Factory output matches Firestore document interfaces exactly. TypeScript compiler catches schema drift.
3. **Law of Overridability**: Factories produce sensible defaults. Tests override only the fields relevant to their assertion.

## Protocol

### Phase 1 — Factory Architecture
1. Create `test/factories/` directory with one factory per Firestore collection.
2. Each factory exports `build(overrides?)` (plain object) and `create(overrides?)` (writes to emulator).
3. Use `faker` or `@faker-js/faker` for realistic random data with seeded RNG for reproducibility.
4. Type factories with collection interfaces: `buildUser(overrides?: Partial<User>): User`.

### Phase 2 — Seed Scripts
1. Create `test/seeds/` with scenario-based seed files: `seed-basic.ts`, `seed-full.ts`.
2. Seeds use factories to populate Firestore emulator via Admin SDK.
3. Script: `ts-node test/seeds/seed-basic.ts` — callable from CLI and CI.
4. Export seed data as JSON fixtures in `test/fixtures/` for snapshot tests.

### Phase 3 — Integration
1. Unit tests: `build()` for plain objects, no Firestore writes.
2. Integration tests: `create()` to write to emulator, return document reference.
3. E2E tests: Run seed script before suite via `globalSetup`.

## I/O

| Input | Output |
|-------|--------|
| Firestore collection interface | Factory function with typed defaults |
| Test scenario description | Seed script populating emulator |
| Override parameters | Custom test entity matching interface |
| Seed execution | Firestore emulator populated with consistent data |

## Quality Gates — 5 Checks

1. **Every collection has a factory** — no orphan collections without test factory.
2. **Factory output passes TypeScript strict check** — no `as any` casts.
3. **Seeded RNG** — `faker.seed(12345)` ensures reproducible data across runs.
4. **Seed scripts idempotent** — running twice produces same state (clearFirestore first).
5. **No inline test data** — lint rule flags object literals in test `describe` blocks.

## Edge Cases

- **Nested subcollections**: Factory `create()` writes parent then children in sequence.
- **Firestore references**: Factory produces document references pointing to other factory-created docs.
- **Timestamps**: Use fixed `Timestamp.fromDate(new Date('2025-01-01'))` — never `Timestamp.now()`.
- **Large datasets**: Seed scripts use batched writes (max 500 per batch) for performance.

## Self-Correction Triggers

- Schema change in Firestore → TypeScript compilation fails in factory → update factory first.
- New collection added → factory required before any test can be written for it.
- Test flakiness from random data → add seed to faker or use fixed fixtures.
- Seed script exceeds 10s → optimize with parallel batch writes.
