---
name: firebase-emulator-setup
description: Firebase Emulator Suite configuration for Firestore, Auth, Functions, Storage, and Hosting with seed data
version: 1.0.0
status: production
owner: Javier Montaño
tags: [testing, firebase-emulator, firestore, auth, functions, storage, hosting, seed-data]
---

# 087 — Firebase Emulator Setup {Testing}

## Purpose
Configure and maintain the Firebase Emulator Suite as the local development and testing backbone. All services (Firestore, Auth, Functions, Storage, Hosting) run locally with reproducible seed data.

## Physics — 3 Immutable Laws

1. **Law of Local Parity**: The emulator environment mirrors production Firebase services. Code that works on emulators works on production (barring quota/scale).
2. **Law of Zero Cloud Cost**: All development and testing happens on emulators. No reads/writes/invocations against live Firebase during dev.
3. **Law of Reproducible State**: Emulators start from exported seed data. Every developer and CI run begins from the same known state.

## Protocol

### Phase 1 — Configuration
1. Run `firebase init emulators` — select Firestore, Auth, Functions, Storage, Hosting.
2. Configure ports in `firebase.json` (non-default to avoid conflicts):
   - Firestore: 8080, Auth: 9099, Functions: 5001, Storage: 9199, Hosting: 5000, UI: 4000.
3. Add emulator config to `firebase.json` under `"emulators"` key.
4. Set `"download"` path for emulator binaries: `.cache/firebase/emulators/`.

### Phase 2 — Seed Data
1. Start emulators, populate manually or via seed script (skill 085).
2. Export state: `firebase emulators:export ./test/emulator-data`.
3. Commit `./test/emulator-data/` to repo for reproducibility.
4. Start with import: `firebase emulators:start --import=./test/emulator-data`.

### Phase 3 — Developer Workflow
1. Add npm script: `"emulators": "firebase emulators:start --import=./test/emulator-data"`.
2. App code detects emulator via `connectFirestoreEmulator()`, `connectAuthEmulator()`, etc.
3. Use environment variable `FIREBASE_EMULATOR=true` to toggle emulator connections.
4. Emulator UI at `localhost:4000` for manual inspection.

## I/O

| Input | Output |
|-------|--------|
| `firebase.json` config | Running emulator instances on configured ports |
| Seed data directory | Pre-populated Firestore, Auth, Storage state |
| App source code | Emulator-connected local development environment |
| CI pipeline | `firebase emulators:exec` test execution |

## Quality Gates — 5 Checks

1. **All 5 emulators configured** — Firestore, Auth, Functions, Storage, Hosting.
2. **Seed data committed** — `test/emulator-data/` exists in repo.
3. **App auto-connects to emulators** when `FIREBASE_EMULATOR=true`.
4. **CI uses emulators** — no live Firebase calls in test pipeline.
5. **Emulator UI accessible** at `localhost:4000` for debugging.

## Edge Cases

- **Java dependency**: Emulators require Java 11+. CI image must include it (`actions/setup-java@v3`).
- **Port conflicts**: Use `lsof -i :8080` to detect. Configure alternative ports in `firebase.json`.
- **Functions environment**: Set functions config for emulator via `functions.config()` or `.env.local`.
- **Storage rules**: Emulator enforces `storage.rules` — ensure rules file is referenced in `firebase.json`.

## Self-Correction Triggers

- Emulator fails to start → check Java version, port conflicts, `firebase.json` syntax.
- Seed data out of sync with schema → re-export after schema migration.
- Developer uses live Firebase accidentally → add runtime check that blocks live calls in dev mode.
- CI emulator timeout → increase `--inspect-functions` timeout, optimize function cold starts.
