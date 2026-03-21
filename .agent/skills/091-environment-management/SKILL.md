---
name: environment-management
description: Dev/staging/prod Firebase project separation, environment variables, .env files, and CLI project aliases
version: 1.0.0
status: production
owner: Javier Montaño
tags: [devops, environment, firebase, env-vars, staging, production, aliases]
---

# 091 — Environment Management {DevOps}

## Purpose
Maintain strict separation between development, staging, and production environments. Ensure no cross-environment data contamination through Firebase project isolation, environment variables, and CLI aliases.

## Physics — 3 Immutable Laws

1. **Law of Isolation**: Each environment (dev/staging/prod) maps to a separate Firebase project. No shared Firestore, Auth, or Storage between environments.
2. **Law of Configuration Over Code**: Environment-specific values live in `.env` files and Firebase project config — never hardcoded in source.
3. **Law of Least Privilege**: Developers have owner access to dev, viewer access to staging, and no direct access to production (CI-only deploys).

## Protocol

### Phase 1 — Firebase Project Setup
1. Create 3 Firebase projects: `myapp-dev`, `myapp-staging`, `myapp-prod`.
2. Configure `.firebaserc` with aliases: `{ "projects": { "dev": "myapp-dev", "staging": "myapp-staging", "prod": "myapp-prod" } }`.
3. Switch environments: `firebase use dev`, `firebase use staging`, `firebase use prod`.

### Phase 2 — Environment Variables
1. Create `.env.development`, `.env.staging`, `.env.production` files.
2. Prefix all vars with `VITE_` (Vite) or `REACT_APP_` (CRA) for client exposure.
3. Firebase config vars: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.
4. Add `.env*` to `.gitignore`. Commit `.env.example` with placeholder values.

### Phase 3 — CI Environment Selection
1. GitHub Actions uses environment secrets per deployment target.
2. Branch mapping: `develop` → dev, `staging` → staging, `main` → prod.
3. Firebase deploy uses alias: `firebase deploy --only hosting -P staging`.
4. Functions config: `firebase functions:config:set` per project or use `.env` in Functions v2.

## I/O

| Input | Output |
|-------|--------|
| Environment name (dev/staging/prod) | Correct Firebase project + config |
| `.env.*` file | Environment-specific variables loaded at build |
| `.firebaserc` aliases | CLI targets correct project |
| CI branch name | Automatic environment selection |

## Quality Gates — 5 Checks

1. **3 separate Firebase projects exist** — dev, staging, prod.
2. **No production credentials in dev `.env`** — verify project IDs differ.
3. **`.env*` files in `.gitignore`** — secrets never committed.
4. **`.env.example` committed** — documents required variables.
5. **CI uses environment-specific secrets** — no shared secrets across environments.

## Edge Cases

- **Functions environment**: Firebase Functions v2 uses `.env` files in `functions/` directory, auto-loaded per project.
- **Emulator override**: When `FIREBASE_EMULATOR=true`, bypass all environment configs — connect to localhost.
- **Third-party services**: Stripe, SendGrid, etc. need separate test/prod API keys per environment.
- **Database migrations**: Schema changes deploy to dev first, then staging, then prod — never skip.

## Self-Correction Triggers

- Dev data appears in staging/prod → audit Firebase project IDs in `.env` files.
- Deploy targets wrong environment → verify `.firebaserc` alias and CI branch mapping.
- Missing env var at runtime → check `.env.example` completeness, CI secret configuration.
- Production access by developer → revoke, enforce CI-only deploy policy.
