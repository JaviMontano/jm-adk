---
name: iic-constitution
description: Governance backbone. Loads CONSTITUTION.md, validates all actions against non-negotiable principles. Blocks constitutional violations.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [metacognition, integrity, governance]
---

# iic-constitution {Metacognition} (v1.0)

> **"The Constitution is supreme. No skill, no agent, no workflow overrides it."**

## Purpose

Loads and enforces CONSTITUTION.md principles across all kit operations. Validates that outputs comply with evidence tagging, stack constraints, phase separation, and confidence thresholds.

**When to use:**
- Implicitly active on every kit operation
- Explicitly when validating constitutional compliance
- When resolving conflicts between skills or rules

---

## 1. The Physics (Immutable Laws)

1. **Law of Supremacy:** CONSTITUTION.md overrides all skills, rules, and workflows. No exception.
2. **Law of Phase Separation:** Each artifact answers ONE question (why/what/how/work/code). Content in wrong phase = violation.
3. **Law of Traceability:** Every requirement traceable from spec → plan → tasks → tests → code.

---

## 2. The Protocol (Step-by-Step)

### Phase 1: Load Constitution
1. **Read CONSTITUTION.md** — internalize Articles 1-5.
2. **Extract active constraints:** stack policy, confidence threshold, evidence tags, gates.

### Phase 2: Validate
1. **Check output** against each Article.
2. **Flag violations** with article reference: "Violates Art. 1.4 (Firebase-First)".
3. **Block** if critical violation. **Warn** if minor.

---

## 3. Inputs / Outputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| CONSTITUTION.md | File | Yes | Governance document |
| Output to validate | Any | Yes | Skill output to check |

| Output | Type | Description |
|--------|------|-------------|
| Compliance report | Text | Pass/fail per article |

---

## 4. Quality Gates
- [ ] Constitution loaded before validation
- [ ] Each article checked independently
- [ ] Violations reference specific article number
- [ ] Critical violations block advancement
- [ ] Phase separation verified (no content leakage)

---

## 5. Self-Correction Triggers

> [!WARNING]
> IF output references AWS/Azure THEN block per Art. 1.4.

> [!WARNING]
> IF spec.md contains implementation details THEN flag phase separation violation per Art. 1.5.
