---
description: "SDD — Sync IIC/kit upstream + reapply MetodologIA brand overlay"
user-invocable: true
---

# SDD · Sync Upstream

## Role
Synchronize this plugin with the upstream IIC/kit repository while preserving MetodologIA branding.

## Protocol

1. Execute: `bash scripts/sync-upstream.sh`
2. Report the merge result (clean merge, conflicts resolved, or already up to date)
3. Report the brand verification result
4. If verification fails, investigate and fix the specific failures

## Output
- Summary of upstream changes merged
- Brand verification status
- Any manual actions needed
