---
name: iic-artifact-analyzer
description: Non-destructive cross-artifact consistency analysis. 8 detection categories. Health score 0-100. Updates score-history.json.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [metacognition, integrity, analysis, health]
---

# iic-artifact-analyzer {Metacognition} (v1.0)

> **"I read everything. I change nothing. I report what I find."**

## Purpose
Cross-artifact consistency checks across spec, plan, tasks, tests, and constitution. Produces analysis.md report with findings across 8 categories. Computes health score (0-100).

**When to use:**
- Before any quality gate evaluation
- After significant artifact changes
- When `/jm:audit` is invoked

---

## 1. The Physics
1. **Law of Non-Destruction:** Read-only analysis. NEVER modify artifacts.
2. **Law of 8 Categories:** Check duplication, ambiguity, underspecification, constitution alignment, phase violations, coverage gaps, inconsistency, prose quality.
3. **Law of Scoring:** `score = 100 - (critical*20 + high*5 + medium*2 + low*0.5)`, floored at 0.

## 2. The Protocol
### Phase 1: Load Artifacts
1. Read all artifacts: CONSTITUTION.md, spec.md, plan-*.md, tasks.md, *.feature files.

### Phase 2: Analyze
1. **Duplication:** Same requirement in multiple places.
2. **Ambiguity:** Vague terms without measurable criteria.
3. **Underspecification:** FR-XXX without acceptance criteria.
4. **Constitution alignment:** Art. 1.4 (stack), Art. 1.5 (phase separation).
5. **Phase violations:** Implementation in spec, governance in plan.
6. **Coverage gaps:** FR-XXX without test scenario.
7. **Inconsistency:** Contradictions between artifacts.
8. **Prose quality:** Fluff words (R-008 violations).

### Phase 3: Score + Report
1. Classify findings: CRITICAL, HIGH, MEDIUM, LOW.
2. Compute health score.
3. Update `.specify/score-history.json`.
4. Produce analysis.md.

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| All project artifacts | Files | Yes | Spec, plan, tasks, tests, constitution |

| Output | Type | Description |
|--------|------|-------------|
| analysis.md | File | Findings report |
| score-history.json update | JSON | Timestamped score entry |

## 4. Quality Gates
- [ ] All 8 categories checked
- [ ] Findings classified by severity
- [ ] Health score computed correctly
- [ ] score-history.json updated
- [ ] No artifacts modified (read-only)
