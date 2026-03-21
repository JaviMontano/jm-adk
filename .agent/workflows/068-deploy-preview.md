---
description: "Firebase preview channel deployment."
command: /jm:deploy-preview
agents_coordinated: [firebase-deployer]
skills_involved: [firebase-hosting-setup]
---

# /jm:deploy-preview

> Firebase preview channel deployment.

## Phase 1: Clarification
Agent asks qualifying questions before proceeding.

## Phase 2: Execution
firebase-deployer executes using firebase-hosting-setup.

## Phase 3: Verification
Quality gate check against defined criteria.
Output validated by output-contract-enforcer.
