---
name: meta-skill-deployer
description: Auto-deploy skills to a target project. Copies skill directories, updates project CLAUDE.md, registers in skills_index.json.
version: 1.0.0
status: production
owner: Javier Montano
tags: [meta, deploy, auto-deploy, install]
---

# meta-skill-deployer {Meta} (v1.0)

> **"Skills that create, review, search, and deploy other skills."**

## Purpose
Installs/deploys skills into target projects. Copies skill directory, updates index, configures project.

**When to use:** When a project needs specific skills activated.

## 1. The Physics
1. **Law of Copy:** Deploy = copy skill directory to target .agent/skills/.
2. **Law of Index:** After deploy, regenerate skills_index.json.
3. **Law of Compatibility:** Only deploy skills compatible with target stack (R-002, R-003).

## 2. The Protocol
### Phase 1: Validate skill exists and is production-ready (status: production).
### Phase 2: Copy skill directory to target project.
### Phase 3: Update target skills_index.json via meta-skill-indexer.

## 3. Quality Gates
- [ ] Operation completed successfully
- [ ] skills_index.json updated if needed
- [ ] context.json reflects current state
- [ ] No stack violations (R-002, R-003)

## 4. Self-Correction Triggers
> [!WARNING]
> IF skills_index.json is stale THEN regenerate before searching.
> IF deploying a skill with status != production THEN WARN user.
