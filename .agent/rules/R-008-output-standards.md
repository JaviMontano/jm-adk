---
name: R-008-output-standards
version: 1.0.0
status: production
enforcement: mandatory
---

# R-008: Output Standards

> **"Markdown-first. Evidence-tagged. Zero fluff."**

## Definition
All kit outputs follow these formatting standards:

### Documentation
- Markdown-first for all documentation artifacts
- Evidence tags required in analysis deliverables (R-001)
- Mermaid diagrams for architecture visualization
- Code blocks with language annotation: ```typescript, ```html, etc.

### Language
- ZERO fluff words: "ensure", "optimize", "carefully", "various", "properly", "leverage", "robust"
- Prescriptive: specific tools, flags, paths, commands
- Opinionated: one recommended approach, not "you could also..."

### Quality
- WCAG AA compliance for all generated HTML
- Lighthouse > 90 for generated web pages
- Consistent heading hierarchy (H1 → H2 → H3, no skipping)

### Metadata
- Metacognition output includes confidence score (0.95+ threshold)
- Analysis outputs include evidence tag summary
- Plans include decision table (D1-D9 format)

### File Organization
- Skills: `NNN-{name} {Category}/SKILL.md`
- Agents: `agents/{agent-name}.md`
- Workflows: `workflows/{command-name}.md`
- Plans: `.specify/plans/plan-YYYY-MM-DD-{task}.md`
- ADRs: `.specify/adrs/ADR-NNN-{title}.md`
- Decisions: `.specify/decisions/DL-NNN-{decision}.md`
- Requirements: `.specify/requirements/RQL-NNN-{requirement}.md`

## Enforcement
- output-contract-enforcer (skill 008) validates all outputs
- quality-gatekeeper (skill 005) checks at gate transitions
