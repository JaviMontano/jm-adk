---
name: session-manager
description: Manages session state, pipeline progress, and cold-start priming. Reads/writes .specify/context.json to track feature stages and artifact completion.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [core, session, state, pipeline]
---

# session-manager {Core} (v1.0)

> **"Every session knows where it left off. Every feature knows its stage."**

## Purpose

Tracks pipeline progress across sessions using `.specify/context.json`. Manages feature stage computation (specified → planned → testified → tasks-ready → implementing → complete) and provides cold-start priming for new sessions.

**When to use:**

- Session initialization (cold-start priming)
- After each phase completion (stage advancement)
- When `/jm:status` is invoked

---

## 1. The Physics (Immutable Laws)

1. **Law of State:** `.specify/context.json` is the single source of truth for project state.
2. **Law of Stages:** Feature stages progress linearly: specified → planned → testified → tasks-ready → implementing-NN% → complete.
3. **Law of Priming:** New sessions must read context.json + last plan + active tasks before starting work.

---

## 2. The Protocol (Step-by-Step)

### Phase 1: Cold-Start Priming

1. **Read `.specify/context.json`** — project state, active features, stage.
2. **Read latest plan** in `.specify/plans/` — most recent plan-FECHA-TAREA.md.
3. **Read active tasks** — tasks.md if exists.
4. **Present status** to user: "Project at stage {X}. Last plan: {Y}. Active tasks: {N}."

### Phase 2: Stage Computation

1. **Check artifact existence:**
   - spec.md → `specified`
   - plan-*.md → `planned`
   - tests/features/*.feature → `testified`
   - tasks.md → `tasks-ready`
   - Implementation progress → `implementing-NN%`
   - All tasks complete → `complete`
2. **Update context.json** with computed stage.
3. **Suggest next action** using the stage progression table.

### Phase 3: State Persistence

1. **After each phase completion**, update context.json stage field.
2. **After each gate pass**, log in score-history.json.
3. **After each decision**, create DL-NNN.md in `.specify/decisions/`.

---

## 3. Inputs / Outputs

### Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| context.json | JSON | Yes | Project state file |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| Status report | Text | Current stage + next steps |
| Updated context.json | JSON | Persisted state changes |

---

## 4. Quality Gates (10x Checklist)

- [ ] **context.json read** at session start
- [ ] **Stage computed** from artifact existence
- [ ] **Next action suggested** based on stage
- [ ] **State persisted** after each phase change

---

## 5. Self-Correction Triggers

> [!WARNING]
> IF context.json is missing THEN create it with initial state from CONSTITUTION.md defaults.

> [!WARNING]
> IF stage is "implementing" but no tasks.md exists THEN **STOP**. Roll back to "planned" stage.
