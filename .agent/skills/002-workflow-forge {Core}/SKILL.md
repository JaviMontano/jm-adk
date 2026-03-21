---
name: workflow-forge
description: Creates new workflows (slash commands) following the Antigravity format with phases, agent coordination, and verification checkpoints.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [core, forge, workflow, scaffold]
---

# workflow-forge {Core} (v1.0)

> **"A workflow is a choreography. Every agent knows its entrance, its solo, and its exit."**

## Purpose

Factory for creating new workflows (slash commands) in the kit. Produces workflow `.md` files that coordinate agents through phases with verification checkpoints.

**When to use:**

- Creating a new slash command workflow
- Standardizing an ad-hoc process into a repeatable workflow
- Extending the kit with new automation sequences

---

## 1. The Physics (Immutable Laws)

1. **Law of Phases:** Every workflow has 2+ phases. Phase 1 is always clarification/planning. Final phase is always verification.
2. **Law of Agents:** Every phase declares which agents execute it. No anonymous work.
3. **Law of Checkpoints:** Between phases, a verification step validates output before proceeding.

---

## 2. The Protocol (Step-by-Step)

### Phase 1: Intent Mapping

1. **Identify the trigger:** What slash command activates this workflow? (`/jm:{command}`)
2. **Map the outcome:** What deliverable does this workflow produce?
3. **List participating agents:** Which agents from the 101-agent roster are involved?

### Phase 2: Phase Design

1. **Phase 1 (Clarification):** Agent asks qualifying questions before proceeding.
2. **Phase 2-N (Execution):** Sequential or parallel agent work with clear inputs/outputs.
3. **Final Phase (Verification):** Quality gate check against defined criteria.

### Phase 3: Assembly

1. **Write the workflow .md** with frontmatter (description, command, skills_involved, agents_coordinated).
2. **Define inputs/outputs** for each phase.
3. **Add example execution** showing a sample dialogue.

---

## 3. Inputs / Outputs

### Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Workflow Name | Text | Yes | Kebab-case command name |
| Description | Text | Yes | One-line purpose |
| Agents | List | Yes | Agent names involved |
| Skills | List | Yes | Skills loaded during execution |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `workflows/{name}.md` | File | Workflow definition |

---

## 4. Quality Gates (10x Checklist)

- [ ] **Frontmatter:** Has description, command, skills_involved, agents_coordinated
- [ ] **Phases:** Minimum 2 phases with clear boundaries
- [ ] **Verification:** Final phase includes quality check
- [ ] **Example:** Contains sample execution dialogue
- [ ] **Stack Compliance:** No AWS/Azure/Docker references (R-002, R-003)

---

## 5. Edge Cases & Antipatterns

### Antipatterns

- **Monolithic:** Single-phase workflow with no checkpoints → **BAD**
- **Agentless:** Workflow that doesn't declare participating agents → **BAD**

### Edge Cases

- **Single-agent workflow:** Still requires 2+ phases (clarify → execute → verify).
- **Cross-mode workflow:** Workflows that span analysis and development (like `full-lifecycle`) must declare mode transitions.

---

## 6. Self-Correction Triggers

> [!WARNING]
> IF workflow has no verification phase THEN **STOP**. Add a quality gate as the final phase.

> [!WARNING]
> IF workflow references non-existent agents or skills THEN **STOP**. Cross-reference against the agent/skill catalog.
