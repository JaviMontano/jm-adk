# JM Agentic Development Kit

> **From requirements to production** — 3 Claude Code plugins for the full software lifecycle.

[![Version](https://img.shields.io/badge/version-3.0.0-FFD700?style=flat-square&labelColor=122562)](https://github.com/JaviMontano/jm-agentic-development-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-FFD700?style=flat-square&labelColor=122562)](https://opensource.org/licenses/MIT)
[![Plugins](https://img.shields.io/badge/plugins-3-137DC5?style=flat-square&labelColor=122562)]()
[![Commands](https://img.shields.io/badge/commands-188-FFD700?style=flat-square&labelColor=122562)]()

---

## What's Inside

| Plugin | Prefix | Agents | Skills | Commands | Focus |
|--------|--------|--------|--------|----------|-------|
| **Sovereign Architect** | `/sa:` | 66 | 128 | 120 | Architecture, code review, evolution, repair |
| **Plugin QA** | `/pqa:` | 4 | 20 | 31 | Plugin development lifecycle |
| **SDD MetodologIA** | `/sdd:` | — | 12 | 37 | Spec Driven Development, BDD, ambient intelligence |

All governed by the **Intent Integrity Kit** — from intent to code with zero drift.

---

## Install

Add this marketplace to Claude Code:

```bash
# From Claude Code CLI
/install-plugin https://github.com/JaviMontano/jm-agentic-development-kit
```

Or clone locally:

```bash
git clone https://github.com/JaviMontano/jm-agentic-development-kit.git
```

---

## Quick Start

```bash
# Architecture & Code
/sa:analyze              # Full 5-phase technical analysis
/sa:run-express          # Quick 80/20 diagnosis
/sa:create               # Scaffold new projects
/sa:review               # Review code quality

# Plugin Development
/pqa:create              # Create a new Claude Code plugin
/pqa:audit               # Full QA audit of a plugin
/pqa:validate            # Quick structural check

# Spec Driven Development
/sdd:tour                # Guided onboarding (8 steps)
/sdd:demo                # Generate demo project + dashboard
/sdd:init                # Initialize SDD in any project
/sdd:sentinel            # Ambient health monitoring
/sdd:graph               # Knowledge graph (Constitution→Tasks)
/sdd:menu                # All 37 commands
```

---

## SDD v3.0 — What's New

SDD (Spec Driven Development, formerly AAD) is now a full operational platform:

| Feature | Description |
|---------|-------------|
| **Per-prompt heartbeat** | Ambient intelligence on every user prompt (< 100ms, zero LLM cost) |
| **Knowledge graph** | Full traceability from constitution principles to tasks |
| **Command Center** | Multi-HTML micro-frontend dashboard with 6 interconnected pages |
| **Onboarding tour** | 8-step interactive walkthrough with Neo-Swiss glassmorphism |
| **RAG memory** | Auto-capture session inputs with MIME detection and JSON indexing |
| **37 commands** | 9-phase pipeline + intelligence + utility + experience commands |
| **4 hooks** | UserPromptSubmit, PostToolUse, SessionStart, PreCompact |

[Full SDD documentation →](https://github.com/JaviMontano/sdd-metodologia)

---

## Governance

Every claim tagged with evidence: `[CODE]` `[CONFIG]` `[DOC]` `[INFERENCE]` `[ASSUMPTION]`

4 quality gates (G0 pre-flight, G1 analysis, G2 architecture, G3 deploy-ready).

Intent Integrity Kit ensures requirements trace through specs, tests, and code without drift.

---

## Architecture

```
jm-agentic-development-kit/
├── sovereign-architect/     # SA v4.0 — Architecture & Code
│   ├── agents/   (66)
│   ├── skills/   (128)
│   └── commands/ (120)
├── plugin-qa/               # PQA v3.0 — Plugin Lifecycle
│   ├── agents/   (4)
│   ├── skills/   (20)
│   └── commands/ (31)
├── sdd-metodologia/         # SDD v3.0 — Spec Driven Development
│   ├── .claude/skills/ (12)
│   ├── commands/ (37)
│   ├── scripts/  (21)
│   └── hooks/    (4 events)
├── CONSTITUTION.md
├── FRAMEWORK-PRINCIPLES.md
├── landing.html
└── .specify/
```

---

## Author

**Javier Montano** — PreSales Architect, MetodologIA founder, JM Labs.

- [metodologia.info](https://metodologia.info)
- Made with Claude Code

---

## License

MIT (code) | GPL-3.0 (MetodologIA brand elements in SDD)
