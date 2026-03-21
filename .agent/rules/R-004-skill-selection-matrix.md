---
name: R-004-skill-selection-matrix
version: 1.0.0
status: production
enforcement: mandatory
---

# R-004: Skill Selection Matrix

> **"Keywords determine destiny. Ambiguity gets a question."**

## Definition
Deterministic routing between analysis and development skill clusters.

### Analysis Keywords → Skills 009-023, Agents 009-025
`analyze`, `assess`, `discover`, `requirements`, `spec`, `stakeholder`, `risk`, `feasibility`, `flow`, `scenario`, `evaluate`, `map`, `strategy`, `competitive`, `cost`, `estimate`

### Development Keywords → Skills 024-101, Agents 026-101
`scaffold`, `create`, `build`, `implement`, `deploy`, `test`, `component`, `page`, `API`, `function`, `auth`, `database`, `hosting`, `performance`, `SEO`, `security`

### Metacognition Keywords → IIC Skills
`plan`, `specify`, `testify`, `clarify`, `analyze-artifacts`, `constitution`, `checklist`

### Ambiguous → Ask User
If request doesn't clearly match analysis or development, ask: "Are you in analysis or development mode?"

## Enforcement
- kit-orchestrator (skill 003) applies this matrix on every request
- Explicit override: `/jm:mode analysis` or `/jm:mode development`
