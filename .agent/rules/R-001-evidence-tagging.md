---
name: R-001-evidence-tagging
version: 1.0.0
status: production
enforcement: mandatory
---

# R-001: Evidence Tagging

> **"No tag, no trust."**

## Definition
Every claim in analysis deliverables MUST carry one evidence tag:
- `[CODE]` — Verified in source code
- `[CONFIG]` — Verified in configuration files
- `[DOC]` — Verified in documentation
- `[INFERENCE]` — Logically derived (reasoning chain stated)
- `[ASSUMPTION]` — Not verified, needs validation

## Conditions
Applies to ALL outputs from skills 009-023 (Analysis & Discovery category) and all `.specify/` artifacts.

## Violations
- Claim without evidence tag
- `[INFERENCE]` without stated reasoning chain
- `[ASSUMPTION]` without validation plan

## Enforcement
- If >30% of claims are `[ASSUMPTION]`, add prominent WARNING banner
- output-contract-enforcer (skill 008) checks tag presence
- quality-gatekeeper (skill 005) validates at G1 gate
