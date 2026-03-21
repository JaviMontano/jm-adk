---
description: "Full discovery pipeline orchestration (phases 0-6)."
command: /jm:run-discovery
agents_coordinated: [discovery-conductor]
skills_involved: [discovery-orchestrator]
---

# /jm:run-discovery

> Full discovery pipeline orchestration (phases 0-6).

## Phase 1: Clarification
Agent asks qualifying questions before proceeding.

## Phase 2: Execution
discovery-conductor executes using discovery-orchestrator.

## Phase 3: Verification
Quality gate check against defined criteria.
Output validated by output-contract-enforcer.
