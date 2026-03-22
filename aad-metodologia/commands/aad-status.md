---
description: "AAD — Pipeline status and brand sync state"
user-invocable: true
---

# AAD · Status

## Role
Report the current state of the IIC pipeline and brand synchronization.

## Protocol

1. Check git remote status: `git log HEAD..upstream/main --oneline` (commits behind upstream)
2. Run brand verification: `bash scripts/verify-brand.sh`
3. Check `.specify/context.json` for pipeline phase state
4. Report:
   - Upstream sync status (up to date or N commits behind)
   - Brand verification result (pass/fail)
   - Active feature and current pipeline phase
   - Next recommended action
