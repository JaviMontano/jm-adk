---
name: ci-cd-pipeline
description: GitHub Actions CI/CD with build, lint, test, deploy stages, Firebase deploy tokens, and branch-based environments
version: 1.0.0
status: production
owner: Javier Montaño
tags: [devops, ci-cd, github-actions, firebase, deployment, automation]
---

# 090 — CI/CD Pipeline {DevOps}

## Purpose
Automate the build-lint-test-deploy lifecycle using GitHub Actions. Every commit is validated, every PR gets a preview deployment, and every merge to main triggers production deploy to Firebase.

## Physics — 3 Immutable Laws

1. **Law of Pipeline as Code**: The CI/CD pipeline lives in `.github/workflows/` — versioned, reviewed, and tested like application code. No manual CI configuration.
2. **Law of Fast Feedback**: Pipeline completes in under 10 minutes. Developers know pass/fail before context-switching.
3. **Law of Environment Parity**: CI builds use the same Node version, npm version, and Firebase CLI version as local development.

## Protocol

### Phase 1 — Pipeline Structure
1. Create `.github/workflows/ci.yml` with jobs: `lint`, `test`, `build`, `deploy`.
2. Use matrix strategy for Node versions if supporting multiple.
3. Cache `node_modules` via `actions/cache` keyed on `package-lock.json` hash.
4. Run jobs in dependency order: lint → test (parallel with build) → deploy.

### Phase 2 — Firebase Deploy Integration
1. Generate Firebase CI token: `firebase login:ci` → store as `FIREBASE_TOKEN` secret.
2. PR branches: `firebase hosting:channel:deploy pr-${{ github.event.number }}`.
3. Main branch: `firebase deploy --only hosting,functions --token $FIREBASE_TOKEN`.
4. Post preview URL as PR comment via `actions/github-script`.

### Phase 3 — Quality Gates in Pipeline
1. Lint: `npm run lint` — fail fast on lint errors.
2. Test: `npm run test:unit -- --coverage` + `firebase emulators:exec "npm run test:integration"`.
3. Build: `npm run build` — fail if TypeScript errors or build warnings.
4. Deploy: conditional on branch (`main` → prod, PR → preview).

## I/O

| Input | Output |
|-------|--------|
| Git push / PR event | Pipeline execution (lint → test → build → deploy) |
| `FIREBASE_TOKEN` secret | Authenticated Firebase deploy |
| PR branch | Preview channel URL posted as comment |
| Main branch merge | Production deployment to Firebase |

## Quality Gates — 5 Checks

1. **All jobs pass** — no skipped required jobs at merge.
2. **Pipeline < 10 minutes** — optimize or parallelize if exceeding.
3. **Secrets never logged** — use `${{ secrets.* }}`, never `echo` secrets.
4. **Branch protection** — main requires passing CI + 1 approval.
5. **Deploy only from CI** — no manual `firebase deploy` to production.

## Edge Cases

- **Monorepo**: Use path filters to run only affected package pipelines.
- **Flaky tests in CI**: Retry step with `retry-action` max 2 attempts. Investigate root cause.
- **Firebase token expiration**: Token doesn't expire, but rotate quarterly as best practice.
- **Concurrent deploys**: Use `concurrency` group to cancel outdated deployments.

## Self-Correction Triggers

- Pipeline exceeds 10 min → profile steps, add caching, parallelize.
- Deploy fails → check Firebase token validity, project permissions, build output.
- PR missing preview URL → verify hosting:channel:deploy step and comment action.
- Secrets exposed in logs → rotate immediately, audit workflow for `echo` statements.
