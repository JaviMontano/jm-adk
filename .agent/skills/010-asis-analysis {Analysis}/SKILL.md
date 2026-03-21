---
name: asis-analysis
description: Current-state 10-section assessment: stack, architecture, code quality, testing, CI/CD, security, performance, data, team, tech debt.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [analysis, asis, assessment, current-state]
---
# asis-analysis {Analysis} (v1.0)
> **"Analyze with evidence. Every claim tagged. Every finding actionable."**
## Purpose
Current-state 10-section assessment: stack, architecture, code quality, testing, CI/CD, security, performance, data, team, tech debt.
**When to use:** During analysis mode (MAO DNA). Before architecture or development begins.
## 1. The Physics
1. **Law of Evidence:** Every finding tagged [CODE], [CONFIG], [DOC], [INFERENCE], or [ASSUMPTION] (R-001).
2. **Law of Completeness:** No analysis deliverable ships without covering all required sections.
3. **Law of Firebase Lens:** All assessments evaluated through Firebase/Google/Hostinger feasibility.
## 2. The Protocol
### Phase 1: Gather
1. Collect inputs (documents, code, conversations, existing systems).
2. Parse for requirements, constraints, and context.
### Phase 2: Analyze
1. Apply domain-specific analysis methodology.
2. Tag all findings with evidence tags.
3. Score/evaluate using the skill's specific metrics.
### Phase 3: Document
1. Produce the analysis deliverable in markdown.
2. Include evidence tag summary (% by tag type).
3. If >30% [ASSUMPTION], add WARNING banner.
## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Project context | Text/Files | Yes | What to analyze |
| Output | Type | Description |
|--------|------|-------------|
| Analysis deliverable | Markdown | Evidence-tagged findings |
## 4. Quality Gates
- [ ] All findings have evidence tags
- [ ] Firebase feasibility assessed
- [ ] Deliverable follows R-008 output standards
- [ ] No implementation details (phase separation)
- [ ] Actionable recommendations included
## 5. Self-Correction Triggers
> [!WARNING]
> IF >30% claims are [ASSUMPTION] THEN add prominent WARNING banner.
> IF analysis contains implementation details THEN move to plan (Art. 1.5 phase separation).
