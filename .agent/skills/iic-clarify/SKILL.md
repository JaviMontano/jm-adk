---
name: iic-clarify
description: Socratic debate for ambiguity reduction. Auto-detects artifact, applies question taxonomy, records answers with traceability to FR/US/T IDs.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [metacognition, integrity, socratic, clarification]
---

# iic-clarify {Metacognition} (v1.0)

> **"The right question prevents 100 wrong assumptions."**

## Purpose
Reduces ambiguity through targeted Socratic questioning. Auto-detects the most recent artifact, applies artifact-specific question taxonomies, and records answers with full traceability.

**When to use:**
- When spec quality score < 6
- When confidence < 0.95 during planning
- When iic-artifact-analyzer detects ambiguity or underspecification
- Anytime understanding is uncertain

---

## 1. The Physics
1. **Law of Materiality:** Questions MUST materially impact downstream phases. No trivial questions.
2. **Law of Taxonomy:** Each artifact type has specific question categories (spec → scope/priority/edge cases, plan → feasibility/alternatives, tasks → dependencies/effort).
3. **Law of Recording:** Answers recorded in `## Clarifications` section with affected item IDs.

## 2. The Protocol
### Phase 1: Detect Artifact
1. Auto-detect most recent artifact: spec, plan, tasks, or constitution.
2. Load artifact-specific question taxonomy.

### Phase 2: Generate Questions
1. Scan artifact for ambiguity triggers (vague terms, missing criteria, unresolved references).
2. Generate 3-7 targeted questions per ambiguity.
3. Rank by impact on downstream phases.

### Phase 3: Record Answers
1. Add `## Clarifications` section to artifact.
2. Format: `- **Q:** {question} → **A:** {answer} | Affects: FR-001, T005`
3. Update affected items with clarification results.

---

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Target artifact | File | Yes | Spec, plan, tasks, or constitution |

| Output | Type | Description |
|--------|------|-------------|
| Clarification questions | Text | Targeted questions |
| Updated artifact | File | Clarifications section added |

## 4. Quality Gates
- [ ] Questions are material (impact downstream phases)
- [ ] Answers linked to affected item IDs
- [ ] Clarifications section added to artifact
- [ ] No questions about information already in artifacts

## 5. Self-Correction Triggers
> [!WARNING]
> IF question answer is already in the artifact THEN **DROP** the question. Don't ask what's documented.

> [!WARNING]
> IF asking more than 10 questions THEN prioritize top 5 by downstream impact.
