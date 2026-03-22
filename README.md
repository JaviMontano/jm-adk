# JM Agentic Development Kit

> **From requirements to production** — 3 Claude Code plugins for the full software lifecycle.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What's Inside

| Plugin | What It Does | Stats |
|--------|-------------|-------|
| **Sovereign Architect** (`/sa:`) | Architecture analysis, code review, scaffolding, evolution, repair | 66 agents, 128 skills, 120 commands |
| **Plugin QA** (`/pqa:`) | Claude Code plugin development lifecycle: ideate through fix | 4 agents, 20 skills, 31 commands |
| **AAD MetodologIA** (`/aad:`) | Specification-driven development with cryptographic BDD verification | 13 skills, 3 commands |

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

# Specification-driven dev
/aad:status              # Show IIKit pipeline status
/aad:dashboard           # Generate visual dashboard
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
├── aad-metodologia/         # IIKit Governance (AAD v1.0)
├── CONSTITUTION.md          # Non-negotiable principles
├── FRAMEWORK-PRINCIPLES.md  # Operating principles
└── .specify/                # Artifact state (ADRs, plans, decisions)
```

---

## Author

**Javier Montano** — PreSales Architect, MetodologIA founder, JM Labs.

- [metodologia.info](https://metodologia.info)
- Made with Claude Code

---

## License

MIT (code) | GPL-3.0 (MetodologIA brand elements in AAD)
