# SDD — Spec Driven Development

> **by metodolog*IA***

[![Version](https://img.shields.io/badge/version-3.0.0-FFD700?style=flat-square&labelColor=122562)](https://github.com/JaviMontano/sdd-metodologia)
[![License](https://img.shields.io/badge/license-GPL--3.0-137DC5?style=flat-square&labelColor=122562)](LICENSE)
[![Commands](https://img.shields.io/badge/commands-37-FFD700?style=flat-square&labelColor=122562)]()
[![Upstream](https://img.shields.io/badge/upstream-IIC%2Fkit-137DC5?style=flat-square&labelColor=122562)](https://github.com/intent-integrity-chain/kit)

Specification-driven AI development with cryptographic BDD verification, ambient intelligence, and MetodologIA's Neo-Swiss branding. SDD conducts software development from governance principles to GitHub issues — or vitamizes your operational process by searching, creating, and deploying skills.

---

## Quick Start

```bash
/sdd:tour              # Guided onboarding (8 interactive steps)
/sdd:demo              # Generate demo project + dashboard
/sdd:init              # Initialize a real project
/sdd:menu              # Command palette — all 37 commands
```

## Features

### 9-Phase Pipeline
Constitution → Specify → Plan → Checklist → Testify → Tasks → Analyze → Implement → Issues. Quality gates G1-G3 halt on violations. Never skip phases.

### Ambient Heartbeat
Per-prompt intelligence via `UserPromptSubmit` hook. Runs < 100ms on every prompt. Detects stale artifacts, missing files, health regression — silently when healthy.

### Knowledge Graph
Full traceability: Constitution principles → Requirements (FR) → Test specs (TS) → Tasks (T). Detects orphans automatically. Renders as force-directed SVG in dashboard.

### Command Center
Multi-HTML micro-frontend dashboard: 6 interconnected pages with shared navigation, design tokens, and data layer. Health gauge, activity feed, smart recommendations.

### RAG Memory
Session inputs captured as `rag-memory-of-{slug}.md` with auto-detected MIME type, HTML structure extraction, abstract + key takeaways + full content. Indexed in JSON.

### Onboarding Tour
8-step interactive walkthrough: pipeline, dashboard, heartbeat, knowledge graph, commands. Neo-Swiss dark glassmorphism modals.

---

## Pipeline

| Phase | Command | Alias | Gate |
|-------|---------|-------|------|
| Init | `/sdd:core` | `/sdd:init` | — |
| 0 | `/sdd:00-constitution` | — | — |
| 1 | `/sdd:01-specify` | `/sdd:spec` | — |
| 2 | `/sdd:02-plan` | `/sdd:plan` | **G1** |
| 3 | `/sdd:03-checklist` | `/sdd:check` | — |
| 4 | `/sdd:04-testify` | `/sdd:test` | — |
| 5 | `/sdd:05-tasks` | `/sdd:tasks` | **G2** |
| 6 | `/sdd:06-analyze` | `/sdd:analyze` | — |
| 7 | `/sdd:07-implement` | `/sdd:impl` | **G3** |
| 8 | `/sdd:08-issues` | `/sdd:issues` | — |

**Utility:** `/sdd:clarify` `/sdd:bugfix` `/sdd:feature` `/sdd:verify` `/sdd:hooks` `/sdd:sync`
**Intelligence:** `/sdd:sentinel` `/sdd:insights` `/sdd:graph` `/sdd:dashboard`
**Memory:** `/sdd:capture` `/sdd:memory`
**Experience:** `/sdd:tour` `/sdd:demo` `/sdd:seed` `/sdd:menu`

---

## Installation

```bash
git clone https://github.com/JaviMontano/sdd-metodologia.git ~/.claude/plugins/sdd-metodologia
```

---

## Architecture

```
sdd-metodologia/
├── .claude-plugin/plugin.json     # v3.0.0 manifest
├── AGENTS.md (→ CLAUDE.md)        # Orchestrator
├── CONSTITUTION.md                # Framework governance
├── HEARTBEAT.md                   # Sentinel spec (perceive-decide-act)
├── CLARIFICATIONS.md              # Decision registry
├── commands/                      # 37 command definitions
├── scripts/
│   ├── sdd-heartbeat-lite.sh      # Per-prompt heartbeat (< 100ms)
│   ├── sdd-knowledge-graph.js     # Traceability graph builder
│   ├── sdd-sentinel.sh            # Full sentinel cycle
│   ├── sdd-insights.js            # Health scores + recommendations
│   ├── sdd-seed-demo.sh           # Demo generator
│   ├── sdd-rag-capture.sh         # RAG memory with MIME detect
│   ├── sdd-tour.html              # Onboarding tour
│   ├── generate-dashboard.js      # Dashboard generator
│   ├── command-center/            # Micro-frontend
│   └── ...                        # Utility scripts
├── .claude/skills/                # 12 IIKit skills
├── hooks/hooks.json               # 4 hook events
├── references/
│   ├── design-tokens.json         # Neo-Swiss brand tokens
│   ├── sequence-diagrams.md       # 7 Mermaid diagrams
│   └── data-schemas.md            # JSON schemas
└── landing.html                   # Branded landing page
```

---

## Hooks

| Event | Script | Purpose |
|-------|--------|---------|
| `UserPromptSubmit` | `sdd-heartbeat-lite.sh` | Per-prompt health check |
| `PostToolUse (Write\|Edit)` | `sdd-session-log.sh` | Audit trail |
| `SessionStart` | `sdd-heartbeat-lite.sh --init` | Context restore |
| `PreCompact` | `sdd-session-log.sh` | State snapshot |

---

## Brand: Neo-Swiss Dark

| Token | Value |
|-------|-------|
| Body | `#020617` |
| Navy | `#122562` |
| Gold | `#FFD700` |
| Blue | `#137DC5` (never green) |
| Headings | Poppins |
| Body | Montserrat |
| Code | JetBrains Mono |
| Cards | `blur(16px) saturate(180%)` |

---

## Credits

- **Upstream**: [Intent Integrity Chain / Kit](https://github.com/intent-integrity-chain/kit) (MIT)
- **Brand**: MetodologIA by Javier Montano (GPL-3.0)
- **Aesthetic**: Neo-Swiss Clean

*SDD v3.0 · Spec Driven Development · by metodologIA*
