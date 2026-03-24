---
description: "SDD — Generate/refresh QA-PLAN.md (DoD, acceptance criteria, gate status, feature quality)"
user-invocable: true
---

# /sdd:qa

Generate or refresh the unified QA Plan artifact.

## Execution

1. Run `node $CLAUDE_PLUGIN_ROOT/scripts/sdd-qa-plan.js .` to scan project artifacts
2. Generates/updates `QA-PLAN.md` at project root (human-readable)
3. Generates/updates `.specify/qa-plan.json` (dashboard consumption)
4. Report: feature count, AC coverage %, test coverage %, gate status

Auto-invoked by `/sdd:analyze` (Phase 6) before cross-artifact validation.

## When to Use

- After completing `/sdd:spec` or `/sdd:test` for any feature
- Before running `/sdd:analyze` (auto-invoked)
- Anytime you want a quality health check
- To verify all features have qa/ sub-artifacts
