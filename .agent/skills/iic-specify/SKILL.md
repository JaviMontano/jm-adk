---
name: iic-specify
description: Creates spec.md with FR-XXX functional requirements, US-X user stories, SC-XXX scenarios. Scores quality 0-10. Traceable requirements.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [metacognition, integrity, specification]
---

# iic-specify {Metacognition} (v1.0)

> **"A spec without FR-XXX tags is not a spec. It's a wish list."**

## Purpose

Generates structured specifications with traceable requirements. Every requirement gets an ID (FR-XXX), every user story gets an ID (US-X), every scenario gets an ID (SC-XXX). Quality scored 0-10.

**When to use:**
- Starting a new feature or project
- Converting vague requirements into structured specs
- When `/jm:write-spec` is invoked

---

## 1. The Physics (Immutable Laws)

1. **Law of IDs:** Every requirement MUST have an ID: FR-001, US-1, SC-001.
2. **Law of Testability:** Every FR-XXX must be testable (measurable acceptance criteria).
3. **Law of WHAT-not-HOW:** Specs describe user outcomes, NEVER implementation details (Art. 1.5).

---

## 2. The Protocol (Step-by-Step)

### Phase 1: Elicit
1. **Parse input** (brief, RFP, conversation) for requirements.
2. **Ask clarifying questions** using iic-clarify if ambiguous.
3. **Identify** functional requirements, user stories, scenarios.

### Phase 2: Structure
1. **Assign IDs:** FR-001 through FR-NNN, US-1 through US-N, SC-001 through SC-NNN.
2. **Write acceptance criteria** for each FR in Given/When/Then format.
3. **Cross-reference:** Each US links to FR-XXX tags. Each SC links to US-X.

### Phase 3: Score
1. **Count FR-XXX patterns** (minimum 5 for score > 5).
2. **Check measurable criteria** presence.
3. **Detect unresolved clarifications.**
4. **Score 0-10.** Below 6 = blocked, requires clarification.

---

## 3. Inputs / Outputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Requirements source | Text/File | Yes | Brief, RFP, conversation |

| Output | Type | Description |
|--------|------|-------------|
| spec.md | File | Structured specification |
| Quality score | Number | 0-10 quality rating |

---

## 4. Quality Gates
- [ ] All requirements have FR-XXX IDs
- [ ] All user stories have US-X IDs
- [ ] Acceptance criteria use Given/When/Then
- [ ] No implementation details in spec (phase separation)
- [ ] Quality score ≥ 6

---

## 5. Self-Correction Triggers

> [!WARNING]
> IF spec contains code snippets or tech stack mentions THEN move to plan.md per Art. 1.5.

> [!WARNING]
> IF quality score < 6 THEN invoke iic-clarify before proceeding.
