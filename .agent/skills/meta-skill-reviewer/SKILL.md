---
name: meta-skill-reviewer
description: Audit existing skills against the 10x rubric. Checks structural integrity, cognitive density, operational safety. Produces score report.
version: 1.0.0
status: production
owner: Javier Montano
tags: [meta, review, audit, quality]
---

# meta-skill-reviewer {Meta} (v1.0)

> **"Skills that create, review, search, and deploy other skills."**

## Purpose
Quality auditor for skills. Runs the 10/10 rubric (3 structural + 4 density + 3 safety) and 5 adversarial stress tests.

**When to use:** `/jm:review-skill "skill-name"` or after creating a new skill.

## 1. The Physics
1. **Law of Rubric:** Score = Structural (3pts) + Density (4pts) + Safety (3pts). Must be 10/10.
2. **Law of Adversarial:** After rubric, run 5 stress tests (ambiguity, edge, contradiction, stress, security).
3. **Law of Non-Destruction:** Read-only audit. Never modify the skill being reviewed.

## 2. The Protocol
### Phase 1: Load skill SKILL.md
### Phase 2: Score against rubric (structure, density, safety)
### Phase 3: Run 5 adversarial tests. Report findings.

## 3. Quality Gates
- [ ] Operation completed successfully
- [ ] skills_index.json updated if needed
- [ ] context.json reflects current state
- [ ] No stack violations (R-002, R-003)

## 4. Self-Correction Triggers
> [!WARNING]
> IF skills_index.json is stale THEN regenerate before searching.
> IF deploying a skill with status != production THEN WARN user.
