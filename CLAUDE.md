# JM Agentic Development Kit v2.0

> Unified marketplace for the full software lifecycle.
> 3 plugins, 70+ agents, 160+ skills, 150+ commands.
> Governed by the Intent Integrity Kit.

---

## Plugins

| Plugin | Prefix | Agents | Skills | Commands | Focus |
|--------|--------|--------|--------|----------|-------|
| **Sovereign Architect** | `/sa:` | 66 | 128 | 120 | Architecture, code review, evolution, repair |
| **Plugin QA** | `/pqa:` | 4 | 20 | 31 | Plugin development lifecycle |
| **AAD MetodologIA** | `/aad:` | 0 | 13 | 3 | Specification-driven governance, BDD |

---

## Quick Start

```bash
# Architecture & Code
/sa:menu                 # SA command palette
/sa:analyze              # Full 5-phase analysis
/sa:run-express          # Quick assessment
/sa:diagnose             # Focused diagnosis
/sa:create               # Generate new artifacts
/sa:review               # Review existing code
/sa:evolve               # Improve code quality
/sa:repair               # Fix failures

# Plugin Development
/pqa:menu                # PQA command palette
/pqa:create              # Full plugin creation pipeline
/pqa:audit               # Full QA audit
/pqa:validate            # Quick structural validation
/pqa:fix                 # Auto-fix common issues

# Specification-Driven Development (IIKit)
/aad:status              # Pipeline status
/aad:dashboard           # Generate branded dashboard
/aad:sync                # Sync upstream IIKit
```

---

## Governance

This kit is governed by the **Intent Integrity Kit** (IIKit):

- **CONSTITUTION.md** — Non-negotiable principles (intent integrity, evidence tagging, phase separation)
- **FRAMEWORK-PRINCIPLES.md** — Five operating principles
- **`.specify/`** — Artifact state management (ADRs, plans, decisions, requirements)

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
├── aad-metodologia/         # AAD v1.0 — IIKit Governance
│   ├── .claude/skills/ (13 iikit-*)
│   ├── commands/ (3)
│   ├── evals/
│   └── tests/
├── CONSTITUTION.md          # IIKit governance
├── FRAMEWORK-PRINCIPLES.md  # Operating principles
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

### AAD MetodologIA (`/aad:`)

Specification-driven AI development powered by Intent Integrity Kit:
- 8-phase workflow: Constitution > Specify > Plan > Checklist > Testify > Tasks > Implement > Issues
- Cryptographic BDD verification (hash-locked .feature files)
- Neo-Swiss branded dashboard

> Full docs: `aad-metodologia/AGENTS.md`

---

## License

MIT (code) + GPL-3.0 (MetodologIA brand elements in AAD)

---

*JM Agentic Development Kit v2.0 — From requirements to production.*
*Made with Claude Code.*
