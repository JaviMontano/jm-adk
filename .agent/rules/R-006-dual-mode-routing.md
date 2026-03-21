---
name: R-006-dual-mode-routing
version: 1.0.0
status: production
enforcement: mandatory
---

# R-006: Dual Mode Routing

> **"Two DNAs, one kit. MAO analyzes, SA develops."**

## Definition
The kit operates in two modes with distinct skill and agent clusters.

### Analysis Mode (MAO DNA)
- **Skills:** 009-023 (input analysis, AS-IS, flows, specs, stakeholders, scenarios, risks)
- **Agents:** 009-025 (requirements-analyst, flow-cartographer, discovery-conductor, etc.)
- **Output:** Specifications, analysis reports, architecture blueprints
- **Gate:** G1 validates analysis completeness

### Development Mode (SA DNA)
- **Skills:** 024-101 (Firebase architecture, scaffolding, coding, testing, deployment)
- **Agents:** 026-101 (firebase-architect, react-developer, cloud-functions-developer, etc.)
- **Output:** Code, configurations, deployed applications
- **Gates:** G2 (architecture), G3 (deployment)

### Mode Detection
1. Auto-detect from user intent per R-004 keyword matrix
2. Explicit: `/jm:mode analysis` or `/jm:mode development`
3. Transition: `/jm:handover-to-dev` moves from analysis to development

## Enforcement
- kit-orchestrator (skill 003) routes based on detected mode
- Mode stored in `.specify/context.json` stage field
