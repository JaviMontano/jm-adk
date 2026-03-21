---
description: "Visual regression test setup."
command: /jm:test-visual
agents_coordinated: [e2e-tester]
skills_involved: [visual-regression-testing]
---

# /jm:test-visual

> Visual regression test setup.

## Phase 1: Clarification
Agent asks qualifying questions before proceeding.

## Phase 2: Execution
e2e-tester executes using visual-regression-testing.

## Phase 3: Verification
Quality gate check against defined criteria.
Output validated by output-contract-enforcer.
