# JM Agentic Development Kit v3.0

> Unified marketplace for the full software lifecycle.
> 3 plugins, 70+ agents, 160+ skills, 188+ commands.
> Governed by the Intent Integrity Kit.

---

## Plugins

| Plugin | Prefix | Agents | Skills | Commands | Hooks | Focus |
|--------|--------|--------|--------|----------|-------|-------|
| **Sovereign Architect** | `/sa:` | 66 | 128 | 120 | — | Architecture, code review, evolution, repair |
| **Plugin QA** | `/pqa:` | 4 | 20 | 31 | — | Plugin development lifecycle |
| **SDD MetodologIA** | `/sdd:` | — | 12 | 37 | 4 | Spec Driven Development, BDD, ambient intelligence |

---

## Quick Start

```bash
# Architecture & Code
/sa:menu                 # SA command palette
/sa:analyze              # Full 5-phase analysis
/sa:run-express          # Quick assessment
/sa:create               # Generate new artifacts
/sa:review               # Review existing code

# Plugin Development
/pqa:menu                # PQA command palette
/pqa:create              # Full plugin creation pipeline
/pqa:audit               # Full QA audit
/pqa:fix                 # Auto-fix common issues

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

This kit is governed by the **Intent Integrity Kit** (IIKit):

- **CONSTITUTION.md** — Non-negotiable principles (intent integrity, evidence tagging, phase separation)
- **FRAMEWORK-PRINCIPLES.md** — Five operating principles
- **`.specify/`** — Artifact state management

### Evidence Tags (mandatory on all claims)

`[CODE]` `[CONFIG]` `[DOC]` `[INFERENCE]` `[ASSUMPTION]`

### Quality Gates

| Gate | When | What |
|------|------|------|
| G0 | Pre-flight | Secrets scan, compliance |
| G1 | After analysis | Evidence present, deliverables complete |
| G2 | After architecture | Data model validated, design documented |
| G3 | Deploy-ready | Tests pass, security clean |

---

## Architecture

```
jm-agentic-development-kit/
├── sovereign-architect/     # SA v4.0 — Architecture & Code
│   ├── agents/   (66)
│   ├── skills/   (128)
│   ├── commands/ (120)
│   └── references/ontology/
├── plugin-qa/               # PQA v3.0 — Plugin Lifecycle
│   ├── agents/   (4)
│   ├── skills/   (20)
│   └── commands/ (31)
├── sdd-metodologia/         # SDD v3.0 — Spec Driven Development
│   ├── .claude/skills/ (12 iikit-*)
│   ├── commands/ (37)
│   ├── scripts/  (21)
│   ├── hooks/    (4 events)
│   └── references/
├── CONSTITUTION.md          # IIKit governance
├── FRAMEWORK-PRINCIPLES.md  # Operating principles
├── landing.html             # Branded landing page
└── .specify/                # Artifact state
```

---

## Plugin Details

### Sovereign Architect (`/sa:`)

Evidence-based technical leadership with 5 movements:
- **CREATE** — Generate new artifacts (scaffolds, specs, tests)
- **REVIEW** — Analyze existing code (architecture, security, performance)
- **EVOLVE** — Improve code quality (refactor, optimize)
- **REPAIR** — Diagnose and fix failures
- **DIAGNOSE** — Focused technical diagnosis

66 specialist agents across architecture, security, performance, data, DevOps, frontend, backend, cloud, and more.

> Full docs: `sovereign-architect/CLAUDE.md`

### Plugin QA (`/pqa:`)

Full plugin development lifecycle with 9 movements:
IDEATE > PLAN > DESIGN > SPECIFY > BUILD > VALIDATE > AUDIT > REPORT > FIX

> Full docs: `plugin-qa/CLAUDE.md`

### SDD MetodologIA (`/sdd:`)

Spec Driven Development — specification-driven AI development with ambient intelligence:

- **9-phase pipeline**: Constitution → Specify → Plan → Checklist → Testify → Tasks → Analyze → Implement → Issues
- **Per-prompt heartbeat**: Ambient monitoring via UserPromptSubmit hook (< 100ms)
- **Knowledge graph**: Full traceability Constitution → FR → TS → Tasks
- **Command Center**: Multi-HTML micro-frontend dashboard
- **RAG memory**: Auto-capture session inputs with MIME detection
- **Onboarding tour**: 8-step interactive walkthrough
- Cryptographic BDD verification (hash-locked .feature files)
- Neo-Swiss branded dashboard

> Full docs: `sdd-metodologia/AGENTS.md`
> Standalone repo: [github.com/JaviMontano/sdd-metodologia](https://github.com/JaviMontano/sdd-metodologia)

---

## License

MIT (code) + GPL-3.0 (MetodologIA brand elements in SDD)

---

*JM Agentic Development Kit v3.0 — From requirements to production.*
*Made with Claude Code.*
