---
name: R-005-quality-gates
version: 1.0.0
status: production
enforcement: mandatory
---

# R-005: Quality Gates

> **"No gate passed, no phase advanced."**

## Definition
Four sequential quality gates enforce phase transitions.

| Gate | Phase Transition | Criteria |
|------|-----------------|----------|
| **G0** | Pre-flight → Work | Secrets scan clean. Stack compliance (R-002/R-003). No AWS/Azure/Docker. |
| **G1** | Analysis → Architecture | All analysis deliverables produced. Evidence tags present (R-001). Stakeholder map exists. Health score > 70. |
| **G2** | Architecture → Development | Firebase architecture documented. Firestore data model validated. Security rules drafted. ADR for key decisions. |
| **G3** | Development → Deployment | All tests pass. Lighthouse > 90. Security audit clean. Monitoring configured. Hostinger/Firebase Hosting ready. |

## Gate Evaluation
- Pass: ALL criteria met → advance
- Fail: ANY criterion unmet → block + list remediation steps
- Score tracked in `.specify/score-history.json`

## Enforcement
- quality-gatekeeper (skill 005) evaluates gates
- session-manager (skill 007) tracks gate status in context.json
- `/jm:advance` triggers gate evaluation before phase transition
