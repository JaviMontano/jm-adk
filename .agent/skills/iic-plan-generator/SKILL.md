---
name: iic-plan-generator
description: Creates plan-YYYY-MM-DD-{task}.md with decision table (D1-DN), technical approach, Firebase services, and fact-checked viability.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [metacognition, integrity, planning]
---

# iic-plan-generator {Metacognition} (v1.0)

> **"Every plan has a decision table. Every decision has a rationale."**

## Purpose

Generates technical plans from specifications. Each plan includes a numbered decision table (D1-DN), Firebase service selection, task preview, and fact-checked viability assessment via internet search.

**When to use:**
- After spec.md is approved (post-G1)
- When `/jm:design-architecture` is invoked
- For any task requiring technical planning

---

## 1. The Physics (Immutable Laws)

1. **Law of Decisions:** Every plan contains a decision table. No decision without scope and rationale.
2. **Law of Fact-Check:** Technical viability validated via WebSearch before plan approval. Confidence ≥ 0.95.
3. **Law of Firebase:** All technical decisions constrained to Firebase/Google/Hostinger stack (Art. 1.4).

---

## 2. The Protocol (Step-by-Step)

### Phase 1: Analyze Spec
1. **Read spec.md** — extract FR-XXX requirements.
2. **Identify technical decisions** needed (database, auth, API, hosting).
3. **Map FR-XXX to Firebase services.**

### Phase 2: Research + Fact-Check
1. **WebSearch** for each technical decision: "Firebase [service] best practices 2026".
2. **Validate viability** within Hostinger constraints.
3. **Score confidence** per decision. Overall must reach ≥ 0.95.

### Phase 3: Draft Plan
1. **Write plan-YYYY-MM-DD-{task}.md** using TEMPLATE from `.specify/plans/`.
2. **Populate decision table** D1 through DN with scope + rationale.
3. **List Firebase services** used (checkbox format).
4. **Preview tasks** (T001-T00N) for iic-task-decomposer.
5. **Create ADR** for significant architectural decisions.

---

## 3. Inputs / Outputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| spec.md | File | Yes | Approved specification |

| Output | Type | Description |
|--------|------|-------------|
| plan-YYYY-MM-DD-{task}.md | File | Technical plan in .specify/plans/ |
| ADR-NNN-{title}.md | File | ADR for significant decisions |
| Confidence metadata | Text | DECOMPOSE→SOLVE→VERIFY→SYNTHESIZE→REFLECT |

---

## 4. Quality Gates
- [ ] Decision table present with D1+ entries
- [ ] Each decision has scope + rationale
- [ ] Firebase services checklist completed
- [ ] Fact-check results documented
- [ ] Confidence ≥ 0.95

---

## 5. Self-Correction Triggers

> [!WARNING]
> IF confidence < 0.95 THEN trigger Socratic debate via iic-clarify + additional WebSearch.

> [!WARNING]
> IF plan references Docker/AWS/Azure THEN **STOP**. Redirect to Firebase equivalent per R-002.
