---
name: code-review-checklist
description: Structured code review covering OWASP security, Core Web Vitals performance, Firebase best practices, and TypeScript types
version: 1.0.0
status: production
owner: Javier Montaño
tags: [testing, code-review, owasp, performance, firebase, typescript, best-practices]
---

# 083 — Code Review Checklist {Testing}

## Purpose
Provide a deterministic, repeatable code review process that catches security vulnerabilities, performance regressions, Firebase anti-patterns, and type safety issues before merge.

## Physics — 3 Immutable Laws

1. **Law of Objectivity**: Every review item is a binary pass/fail check — no subjective opinions. The checklist is the standard.
2. **Law of Shift Left**: Catch defects at review time, not in production. A review that misses a security flaw is a review failure.
3. **Law of Knowledge Transfer**: Reviews spread codebase knowledge. Every review must have at least one comment explaining WHY, not just WHAT.

## Protocol

### Phase 1 — Security Review (OWASP)
1. No secrets in code (API keys, tokens, passwords) — use env vars or Secret Manager.
2. User input sanitized — XSS prevention via React's default escaping + DOMPurify for dangerouslySetInnerHTML.
3. Firestore rules enforce auth — no open read/write rules in production.
4. CORS configured restrictively — no `*` origins.
5. Dependencies audited — `npm audit` shows zero high/critical.

### Phase 2 — Performance & Firebase
1. No unbounded Firestore queries — `limit()` on every `getDocs()`.
2. No Firestore reads in loops — batch or use `in` queries.
3. Images optimized — WebP format, lazy loading, responsive srcset.
4. Bundle impact assessed — no new dependency > 50KB without justification.
5. Cloud Functions cold start mitigated — minimal imports, lazy initialization.

### Phase 3 — Code Quality & Types
1. No `any` types — use `unknown` + type guards if type is uncertain.
2. No `eslint-disable` without JIRA ticket comment.
3. Functions < 50 lines, files < 300 lines — extract if exceeding.
4. Naming is intention-revealing — no abbreviations, no single-letter variables (except loops).
5. Error handling explicit — no swallowed catches, user-facing errors use error boundary.

## I/O

| Input | Output |
|-------|--------|
| Pull request diff | Completed checklist (pass/fail per item) |
| Changed files list | Security, performance, quality scores |
| Dependency changes | `npm audit` report |
| Firestore rule changes | Rule coverage verification |

## Quality Gates — 5 Checks

1. **Zero OWASP Top 10 violations** — any finding blocks merge.
2. **No unbounded Firestore queries** — every query has `limit()` or pagination.
3. **TypeScript strict mode** — no `any`, no `@ts-ignore` without ticket.
4. **Bundle size delta < 50KB** — justify or code-split if exceeding.
5. **All review items addressed** — no unresolved comments at merge.

## Edge Cases

- **Hotfix PRs**: Run abbreviated checklist (security + critical performance only). Full review within 48h.
- **Dependency-only PRs**: Focus on `npm audit`, license check, bundle size delta.
- **Firestore rule changes**: Require integration test proof (skill 080) in PR.
- **Generated code**: Exclude from line-count rules but include in security review.

## Self-Correction Triggers

- Production incident traced to missed review item → add to checklist permanently.
- Review turnaround > 24h → escalate or split PR into smaller changes.
- Same defect found 3x → add automated lint rule to prevent it.
- Reviewer approves without checklist completion → flag in team retro.
