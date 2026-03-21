---
name: iic-bugfix
description: Structured bug tracking. Creates bug entries with severity, reproduction steps, and T-B tasks. Links to affected requirements.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [metacognition, integrity, bugs, tracking]
---

# iic-bugfix {Metacognition} (v1.0)

> **"A bug without reproduction steps is not a bug report. It's a rumor."**

## Purpose
Creates structured bug entries in bugs.md with severity, reproduction steps, and assigned T-B tasks. Links bugs to affected FR-XXX requirements.

**When to use:**
- When a bug is discovered during implementation or testing
- When `/jm:repair` is invoked

---

## 1. The Physics
1. **Law of Structure:** Bug format: ID, severity, reproduction, affected FR-XXX, assigned T-B task.
2. **Law of Traceability:** Every bug links to affected requirements.
3. **Law of Tasks:** Every bug gets a T-B### task in tasks.md.

## 2. The Protocol
### Phase 1: Document Bug
1. Assign bug ID (BUG-NNN).
2. Record: severity (critical/high/medium/low), reproduction steps, expected vs actual.
3. Link to affected FR-XXX/US-X.

### Phase 2: Create Fix Task
1. Add `- [ ] [T-B###] [BUG-NNN] Fix: {description}` to tasks.md.
2. If test assertion needs update → re-specify via iic-testify (not direct edit).

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Bug description | Text | Yes | What went wrong |

| Output | Type | Description |
|--------|------|-------------|
| bugs.md entry | File | Structured bug report |
| tasks.md update | File | T-B### fix task |

## 4. Quality Gates
- [ ] Bug has reproduction steps
- [ ] Linked to affected FR-XXX
- [ ] Fix task created in tasks.md
