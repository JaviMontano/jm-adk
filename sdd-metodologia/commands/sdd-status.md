---
description: "SDD — Pipeline status and brand sync state"
user-invocable: true
---

# SDD · Status

## Role
Report the current state of the IIC pipeline and brand synchronization.

## Protocol

1. Run the SDD status script for visual pipeline overview:
   ```bash
   bash scripts/sdd-status.sh .
   ```
2. Run the next-step advisor:
   ```bash
   bash scripts/sdd-next-step.sh .
   ```
3. Optionally check upstream sync:
   ```bash
   git log HEAD..upstream/main --oneline 2>/dev/null
   ```
4. Optionally verify brand integrity:
   ```bash
   bash scripts/verify-brand.sh
   ```

The status script shows: global artifacts (CONSTITUTION, PREMISE, context, dashboard) + per-feature pipeline table with phase completion dots.
