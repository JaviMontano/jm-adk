---
name: iic-core-engine
description: State machine and next-step guidance. Computes feature stage from artifacts. Suggests next action. Updates context.json.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [metacognition, integrity, state-machine, engine]
---

# iic-core-engine {Metacognition} (v1.0)

> **"I know where you are. I know where you should go next."**

## Purpose
Central state machine. Computes project stage from artifact existence. Suggests the next skill/workflow to invoke. Single source of truth for workflow progression.

**When to use:**
- Session start (cold-start priming)
- When `/jm:status` is invoked
- After any phase completion

---

## 1. The Physics
1. **Law of State:** context.json is the single source of truth.
2. **Law of Stages:** specified → planned → testified → tasks-ready → implementing-NN% → complete.
3. **Law of Suggestion:** Always recommend next action based on current stage.

## 2. The Protocol
### Phase 1: Compute Stage
1. Check artifact existence:
   - spec.md exists → `specified`
   - plan-*.md exists → `planned`
   - *.feature files exist → `testified`
   - tasks.md exists → `tasks-ready`
   - Implementation progress → `implementing-NN%`
   - All tasks complete → `complete`

### Phase 2: Suggest Next
| Stage | Next Action |
|-------|-------------|
| (none) | `/jm:write-spec` → create spec.md |
| specified | `/jm:design-architecture` → create plan |
| planned | iic-testify → create .feature files |
| testified | iic-task-decomposer → create tasks.md |
| tasks-ready | iic-implement → start coding |
| implementing | Continue tasks, run tests |
| complete | `/jm:deploy-firebase` or `/jm:deploy-hostinger` |

### Phase 3: Update State
1. Update context.json stage field.
2. Log transition in score-history.json.

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| context.json | JSON | Yes | Current state |
| Project artifacts | Files | Yes | For stage computation |

| Output | Type | Description |
|--------|------|-------------|
| Status report | Text | Stage + next action |
| context.json update | JSON | Updated stage |

## 4. Quality Gates
- [ ] Stage computed from actual artifact existence
- [ ] Next action maps to valid skill/workflow
- [ ] context.json updated after state change
