---
name: iic-task-decomposer
description: Decomposes plans into tasks with format [T###] [P?] [US#] Description. Marks parallelizable tasks, tracks dependencies, estimates effort.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [metacognition, integrity, tasks, decomposition]
---

# iic-task-decomposer {Metacognition} (v1.0)

> **"Every task has an ID, a user story link, and a clear deliverable."**

## Purpose
Converts technical plans into actionable task lists. Format: `- [ ] [T###] [P?] [US#] Description`. Identifies parallelizable tasks [P], dependency chains, and critical path.

**When to use:**
- After plan is approved
- When `/jm:write-user-stories` produces stories

---

## 1. The Physics
1. **Law of Format:** Every task: `- [ ] [T###] [P?] [US#] Description`. Missing elements = validation failure.
2. **Law of Traceability:** Every task links to at least one US-X from spec.
3. **Law of Parallelism:** Tasks marked [P] can execute simultaneously. Unmarked = sequential.

## 2. The Protocol
### Phase 1: Parse Plan
1. Read plan decisions (D1-DN) and task preview.
2. Map decisions to implementation work items.

### Phase 2: Decompose
1. Create T001-TNNN tasks in descending granularity.
2. Mark parallelizable tasks with [P].
3. Link each to US-X.
4. Identify dependencies between tasks.

### Phase 3: Validate
1. Check all tasks have [T###] and [US#].
2. Detect circular dependencies.
3. Identify orphan tasks (no US link).
4. Flag critical path.

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| plan-*.md | File | Yes | Technical plan |
| spec.md | File | Yes | For US-X linking |

| Output | Type | Description |
|--------|------|-------------|
| tasks.md | File | Decomposed task list |

## 4. Quality Gates
- [ ] All tasks have [T###] format
- [ ] All tasks link to US-X
- [ ] No circular dependencies
- [ ] Critical path identified
- [ ] Parallelizable tasks marked [P]

## 5. Self-Correction Triggers
> [!WARNING]
> IF task has no US-X link THEN flag as orphan — may indicate missing spec coverage.
