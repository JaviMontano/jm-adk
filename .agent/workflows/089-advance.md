---
description: "Advance to next pipeline phase with gate validation."
command: /jm:advance
agents_coordinated: [quality-auditor]
skills_involved: [quality-gatekeeper, iic-core-engine]
---

# /jm:advance

> Advance to next pipeline phase with gate validation.

## Phase 1: Clarification
Agent asks qualifying questions before proceeding.

## Phase 2: Execution
quality-auditor executes using quality-gatekeeper, iic-core-engine.

## Phase 3: Verification
Quality gate check against defined criteria.
Output validated by output-contract-enforcer.
