---
name: meta-orchestration-updater
description: Auto-updates orchestration state. Syncs context.json, score-history.json, skills_index.json. Triggers dashboard regeneration.
version: 1.0.0
status: production
owner: Javier Montano
tags: [meta, orchestration, sync, auto-update]
---

# meta-orchestration-updater {Meta} (v1.0)

> **"Skills that create, review, search, and deploy other skills."**

## Purpose
Keeps all orchestration artifacts in sync. Updates context.json stage, regenerates index, refreshes dashboard.

**When to use:** After any pipeline phase completion or artifact change. Run `/jm:status` to trigger.

## 1. The Physics
1. **Law of Sync:** context.json, score-history.json, and skills_index.json must reflect current state.
2. **Law of Dashboard:** After state change, regenerate .specify/dashboard.html.
3. **Law of Automation:** This skill runs automatically after gate passes and phase transitions.

## 2. The Protocol
### Phase 1: Read current .specify/context.json state.
### Phase 2: Compute stage from artifact existence. Update context.json.
### Phase 3: Regenerate skills_index.json + dashboard.html. Update score-history.json.

## 3. Quality Gates
- [ ] Operation completed successfully
- [ ] skills_index.json updated if needed
- [ ] context.json reflects current state
- [ ] No stack violations (R-002, R-003)

## 4. Self-Correction Triggers
> [!WARNING]
> IF skills_index.json is stale THEN regenerate before searching.
> IF deploying a skill with status != production THEN WARN user.
