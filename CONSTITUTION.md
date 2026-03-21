# JM Agentic Development Kit — Constitution v1.0.0

> MetodologIA · Made with Claude Code and Tons of Love with the Help of Pristino Agent
> Based on intent-integrity-chain/kit, adapted for MetodologIA ecosystem

## Preamble

This Constitution governs the JM Agentic Development Kit (JM-ADK), a dual-mode agentic system merging **MAO's analysis power** with **SA's development power**, targeting **Firebase, HTML/CSS/JS, Node.js, Angular/React** with deployment to **Hostinger** and **Firebase Hosting**.

---

## Article 1: Non-Negotiable Principles

### 1.1 Intent Integrity
Every requirement MUST be traceable from specification through implementation. SHA256 hash-locked test assertions prevent silent requirement drift.

### 1.2 Metacognitive Confidence ≥ 0.95
Every complex response achieves confidence ≥ 0.95 through DECOMPOSE → SOLVE → VERIFY → SYNTHESIZE → REFLECT. If < 0.95, trigger Socratic debate + internet fact-checking.

### 1.3 Evidence Tagging
Every claim carries: `[CODE]`, `[CONFIG]`, `[DOC]`, `[INFERENCE]`, or `[ASSUMPTION]`. If >30% are `[ASSUMPTION]`, display prominent warning.

### 1.4 Firebase-First Stack
All architecture targets Firebase/Google ecosystem. No AWS, no Azure, no Docker/K8s for deployment. Hostinger for static/Node.js hosting.

### 1.5 Phase Separation
| Phase | Answers | Artifact |
|-------|---------|----------|
| Constitution | WHY | CONSTITUTION.md |
| Specification | WHAT | spec.md |
| Plan | HOW | plan-FECHA-TAREA.md |
| Tasks | WORK | tasks.md |
| Implementation | CODE | Source files |

### 1.6 Skills-First Architecture
All capabilities delivered as AI agent skills in `.agent/skills/`. Scripts exist only to support skill execution.

### 1.7 Quality Gates
| Gate | Criteria |
|------|----------|
| G0 | Secrets scan clean, stack compliance |
| G1 | Analysis deliverables complete, evidence tags present |
| G2 | Firebase architecture documented, data model validated |
| G3 | Tests pass, Lighthouse > 90, security audit clean |

---

## Article 2: Dual-Mode Operation

### 2.1 Analysis Mode (MAO DNA)
Skills 009-023, Agents 009-025. Input analysis, AS-IS assessment, flow mapping, functional specs, stakeholder mapping, scenario analysis, risk assessment, discovery orchestration.

### 2.2 Development Mode (SA DNA)
Skills 024-101, Agents 026-101. Firebase architecture, scaffolding (React, Angular, HTML), Cloud Functions, Firestore, testing, CI/CD, deployment, performance, documentation.

### 2.3 Mode Detection
Auto-detect from user intent per R-004. Explicit: `/jm:mode analysis` or `/jm:mode development`.

---

## Article 3: Artifact Governance

### 3.1 Required Artifacts Per Feature
- `spec.md` — User stories (US-X), functional requirements (FR-XXX), scenarios (SC-XXX)
- `plan-YYYY-MM-DD-{task}.md` — Technical plan with decision table (D1-DN)
- `tasks.md` — Task decomposition: `[T###] [P?] [US#] Description`
- `ADR-NNN-{title}.md` — Architecture Decision Record (significant decisions)
- `DL-NNN-{decision}.md` — Decision Log (all decisions)
- `RQL-NNN-{requirement}.md` — Requirement Log

### 3.2 Hash Integrity
Feature files (.feature) SHA256 hash-locked BEFORE implementation. Pre-commit hooks block assertion modifications without re-specification.

### 3.3 Health Score
`score = 100 - (critical*20 + high*5 + medium*2 + low*0.5)`, floored at 0.

---

## Article 4: Metacognition Protocol

### 4.1 Structured Reasoning
```
1. DECOMPOSE — Break into atomic sub-problems
2. SOLVE — Address each with explicit confidence (0.0-1.0)
3. VERIFY — Logic, facts, completeness, bias check
4. SYNTHESIZE — Combine with weighted confidence
5. REFLECT — If < 0.95, identify weakness + seek more info
```

### 4.2 Mandatory Output Metadata
```
📊 METADATA DE RAZONAMIENTO:
• Confianza global: [0.95+]
• Fuentes consultadas: [list]
• Debilidades identificadas: [if any]
• Nivel de rigidez: [exploratoria | analítica | ejecutiva]
```

### 4.3 Fact-Checking
Plans and architectural decisions fact-checked via internet search for technical and business viability before approval.

---

## Article 5: Branding

- **Organization**: MetodologIA
- **Kit Name**: JM Agentic Development Kit (BETA)
- **Attribution**: Made with Claude Code and Tons of Love with the Help of Pristino Agent
- **Fork Notice**: Based on intent-integrity-chain/kit
- **License**: MIT

---

## Amendments

Changes require a DL (Decision Log) entry with rationale.

*Constitution v1.0.0 — 2026-03-21 · MetodologIA · JM Labs · Javier Montaño*
