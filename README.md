# JM Agentic Development Kit

> **From requirements to production** — 3 Claude Code plugins for the full software lifecycle.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What's Inside

| Plugin | What It Does | Stats |
|--------|-------------|-------|
| **Sovereign Architect** (`/sa:`) | Architecture analysis, code review, scaffolding, evolution, repair | 66 agents, 128 skills, 120 commands |
| **Plugin QA** (`/pqa:`) | Claude Code plugin development lifecycle: ideate through fix | 4 agents, 20 skills, 31 commands |
| **SDD MetodologIA** (`/sdd:`) | Spec Driven Development with cryptographic BDD verification + ambient intelligence | 12 skills, 37 commands, 4 hooks |

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
# Architecture & code review
/sa:analyze              # Full 5-phase technical analysis
/sa:run-express          # Quick 80/20 diagnosis
/sa:create               # Scaffold new projects
/sa:review               # Review code quality

# Plugin development
/pqa:create              # Create a new Claude Code plugin
/pqa:audit               # Full QA audit of a plugin
/pqa:validate            # Quick structural check

# Spec Driven Development
/sdd:tour                # Guided onboarding (8 steps)
/sdd:demo                # Generate demo project + dashboard
/sdd:init                # Initialize SDD in any project
/sdd:menu                # All 37 commands at a glance
/sdd:sentinel            # Ambient health monitoring
/sdd:graph               # Knowledge graph (Constitution→Tasks)
```

---

## Governance

Every claim tagged with evidence: `[CODE]` `[CONFIG]` `[DOC]` `[INFERENCE]` `[ASSUMPTION]`

4 quality gates (G0 pre-flight, G1 analysis, G2 architecture, G3 deploy-ready).

Intent Integrity Kit ensures requirements trace through specs, tests, and code without drift.

---

## Architecture

```
jm-agentic-development-kit/
├── sovereign-architect/     # Architecture & Code (SA v4.0)
├── plugin-qa/               # Plugin Lifecycle (PQA v3.0)
├── sdd-metodologia/         # Spec Driven Development (SDD v3.0)
├── CONSTITUTION.md          # Non-negotiable principles
├── FRAMEWORK-PRINCIPLES.md  # Operating principles
└── .specify/                # Artifact state (ADRs, plans, decisions)
```

### SDD v3.0 — What's New

SDD (formerly AAD) is now a full operational platform:
- **Per-prompt heartbeat** — Ambient intelligence on every user prompt
- **Knowledge graph** — Full traceability from constitution to tasks
- **Command Center** — Multi-HTML micro-frontend dashboard
- **Onboarding tour** — 8-step interactive walkthrough
- **RAG memory** — Auto-capture session inputs with MIME detection
- **37 commands** — From `/sdd:init` to `/sdd:issues`

[Full SDD documentation →](https://github.com/JaviMontano/sdd-metodologia)

---

## Author

**Javier Montano** — PreSales Architect, MetodologIA founder, JM Labs.

- [metodologia.info](https://metodologia.info)
- Made with Claude Code

---

## License

MIT (code) | GPL-3.0 (MetodologIA brand elements in SDD)
