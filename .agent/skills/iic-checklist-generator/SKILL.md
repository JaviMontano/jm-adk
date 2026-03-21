---
name: iic-checklist-generator
description: Creates phase-specific QA checklists with pass/fail items linked to FR-XXX, US-X, SC-XXX. Validates readiness before phase transitions.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [metacognition, integrity, quality]
---

# iic-checklist-generator {Metacognition} (v1.0)

> **"A checklist is a contract between phases. Pass all or don't advance."**

## Purpose
Generates phase-specific QA validation checklists. Each item is linked to spec IDs (FR-XXX, US-X) and has binary pass/fail status.

**When to use:**
- Before any quality gate evaluation (G0-G3)
- When validating phase readiness

---

## 1. The Physics
1. **Law of Linkage:** Every checklist item links to at least one FR-XXX or US-X.
2. **Law of Binary:** Items are pass or fail. No partial credit.
3. **Law of Phase:** Checklist criteria match the specific gate (G0/G1/G2/G3).

## 2. The Protocol
### Phase 1: Identify Gate
1. Read current stage from context.json.
2. Select gate criteria from R-005.

### Phase 2: Generate Checklist
1. Create items from gate criteria.
2. Link each to spec IDs.
3. Format: `- [ ] [FR-001] {criterion}`

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Gate ID | Enum | Yes | G0, G1, G2, G3 |
| spec.md | File | Yes | For ID linking |

| Output | Type | Description |
|--------|------|-------------|
| checklist.md | File | Pass/fail checklist |

## 4. Quality Gates
- [ ] All items linked to spec IDs
- [ ] Binary pass/fail for each item
- [ ] Gate-specific criteria complete

## 5. Self-Correction Triggers
> [!WARNING]
> IF checklist item has no spec ID link THEN add link or flag as orphan.
