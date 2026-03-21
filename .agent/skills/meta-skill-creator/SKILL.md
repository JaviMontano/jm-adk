---
name: meta-skill-creator
description: Create new 10x skills using the skill-forge protocol. Loads reference sub-repo, applies Trinity (Alfa-Atoms-Beta), validates with 10/10 rubric.
version: 1.0.0
status: production
owner: Javier Montano
tags: [meta, forge, create, scaffold]
---

# meta-skill-creator {Meta} (v1.0)

> **"Skills that create, review, search, and deploy other skills."**

## Purpose
Factory for new skills. Follows the skill-forge Trinity: load context (Alfa) → manufacture (Atoms) → verify (Beta). Every skill must score 10/10.

**When to use:** `/jm:create-skill "skill description"`

## 1. The Physics
1. **Law of Context-First:** Read reference/ before writing. knowledge_graph → best_practices → output_template → self_evaluation.
2. **Law of 10/10:** No skill ships below 10/10 on self-evaluation rubric.
3. **Law of MOAT:** Every skill gets SKILL.md + reference/ + prompts/ + examples/ + tests/.

## 2. The Protocol
### Phase 1: Context Loading
1. Read skill-forge reference files (knowledge_graph, best_practices, output_template, self_evaluation).
2. Decompose user request into the knowledge graph taxonomy.

### Phase 2: Manufacture
1. Draft SKILL.md using output_template scaffold.
2. Create reference/ files if skill has >3 laws or >5 steps.
3. Create at least one prompt in prompts/.

### Phase 3: Verify
1. Score against self_evaluation rubric — must achieve 10/10.
2. Run 5 adversarial tests (ambiguity, edge case, contradiction, stress, security).
3. Update skills_index.json via meta-skill-indexer.

## 3. Quality Gates
- [ ] Operation completed successfully
- [ ] skills_index.json updated if needed
- [ ] context.json reflects current state
- [ ] No stack violations (R-002, R-003)

## 4. Self-Correction Triggers
> [!WARNING]
> IF skills_index.json is stale THEN regenerate before searching.
> IF deploying a skill with status != production THEN WARN user.
