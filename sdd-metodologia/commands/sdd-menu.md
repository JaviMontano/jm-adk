---
description: "SDD — Command palette with all available commands"
user-invocable: true
---

# /sdd:menu

Display the complete SDD command palette.

## Execution

First run `bash scripts/sdd-next-step.sh .` to show the recommended next action, then display the palette:

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║  SDD — Spec Driven Development · MetodologIA Edition   ║
╚══════════════════════════════════════════════════════════════╝

PIPELINE PHASES
  /sdd:core             Project init, status, feature selection
  /sdd:00-constitution  Define governance principles
  /sdd:01-specify       Feature specification from NL              [alias: /sdd:spec]
  /sdd:clarify          Resolve ambiguities in any artifact
  /sdd:02-plan          Technical design                           [alias: /sdd:plan]  [GATE]
  /sdd:03-checklist     Quality requirements checklists             [alias: /sdd:check]
  /sdd:04-testify       BDD Gherkin test specs                     [alias: /sdd:test]
  /sdd:05-tasks         Dependency-ordered task breakdown           [alias: /sdd:tasks]
  /sdd:06-analyze       Cross-artifact consistency                  [alias: /sdd:analyze] [GATE]
  /sdd:07-implement     Execute implementation                     [alias: /sdd:impl]  [GATE]
  /sdd:08-issues        Export tasks to GitHub Issues               [alias: /sdd:issues]

UTILITIES
  /sdd:bugfix           Bug report + fix tasks                     [alias: /sdd:fix]
  /sdd:feature          Create, select, or list features
  /sdd:sync             Sync upstream IIC/kit + reapply brand
  /sdd:dashboard        Generate Neo-Swiss branded dashboard
  /sdd:status           Pipeline overview + next step advisor
  /sdd:verify           Run verification suite (7 categories)
  /sdd:hooks            Install git hooks for assertion integrity
  /sdd:menu             This command palette

KNOWLEDGE & MEMORY
  /sdd:capture          Capture session inputs to RAG memory files
  /sdd:memory           Browse and search RAG memory archive

SENTINEL (Autonomous Heartbeat)
  /sdd:sentinel         Start/stop/status heartbeat agent
  /sdd:insights         Health trends, risks, recommendations

[GATE] = Critical gate — halts pipeline on violations. Never skip.
Upstream: intent-integrity-chain/kit (MIT) · Brand: MetodologIA (GPL-3.0)
```
