# SDD v3.0 — Spec Driven Development · MetodologIA Edition

> **SDD by MetodologIA** — Spec Driven Development with Neo-Swiss branding.
> Specification-driven development with cryptographic BDD verification + ambient intelligence.
> 12 skills · 9 pipeline phases · 38 commands · 20 scripts · Per-prompt heartbeat · Knowledge graph · Command Center
> Upstream engine: [intent-integrity-chain/kit](https://github.com/intent-integrity-chain/kit) (MIT)
> Brand layer: GPL-3.0 · Javier Montano · MetodologIA

---

## Quick Start

```bash
/sdd:tour              # Guided onboarding tour (8 steps)
/sdd:demo              # Generate demo project + dashboard
/sdd:init              # Initialize a real project
/sdd:menu              # Command palette — all commands
```

## Ambient Intelligence

SDD runs a **per-prompt heartbeat** via `UserPromptSubmit` hook. On every user prompt:
1. `sdd-heartbeat-lite.sh` executes (< 100ms, zero LLM cost)
2. Checks: stale artifacts, missing files, health regression
3. If findings: injects 1-line context "⚡ SDD: N stale, M missing — /sdd:sentinel"
4. If healthy: silent (zero output, zero cost)
5. Suppression: 45-90 min of quiet after clean sentinel run

**Hooks active:**
- `UserPromptSubmit` → heartbeat-lite.sh (per-prompt)
- `PostToolUse (Write|Edit)` → session-log.sh (audit trail)
- `SessionStart` → heartbeat-lite.sh --init (context restore)
- `PreCompact` → session-log.sh pre-compact (state snapshot)

## SDD Pipeline Commands

| Phase | Command | Alias | Description |
|-------|---------|-------|-------------|
| Init | `/sdd:core` | `/sdd:init` | Project init, status, feature selection, help |
| 0 | `/sdd:00-constitution` | — | Define governance principles and coding standards |
| 1 | `/sdd:01-specify` | `/sdd:spec` | Feature specification from natural language |
| — | `/sdd:clarify` | — | Resolve ambiguities in any artifact |
| 2 | `/sdd:02-plan` | `/sdd:plan` | Technical design document **[GATE]** |
| 3 | `/sdd:03-checklist` | `/sdd:check` | Quality checklists (unit tests for English) |
| 4 | `/sdd:04-testify` | `/sdd:test` | BDD Gherkin specs with assertion hashing |
| 5 | `/sdd:05-tasks` | `/sdd:tasks` | Dependency-ordered task breakdown |
| 6 | `/sdd:06-analyze` | `/sdd:analyze` | Cross-artifact consistency **[GATE]** |
| 7 | `/sdd:07-implement` | `/sdd:impl` | Execute implementation **[GATE]** |
| 8 | `/sdd:08-issues` | `/sdd:issues` | Export tasks to GitHub Issues |
| Bug | `/sdd:bugfix` | `/sdd:fix` | Bug report + fix tasks |

**[GATE]** = Critical gate — halts on violations. Never skip phases.

## Intelligence Commands

| Command | Description |
|---------|-------------|
| `/sdd:sentinel` | Full sentinel cycle (perceive-decide-act, zero LLM cost) |
| `/sdd:insights` | Health trends, risk indicators, smart recommendations |
| `/sdd:graph` | Build knowledge graph (Constitution→FR→TS→Tasks traceability) |
| `/sdd:dashboard` | Generate Command Center (multi-HTML micro-frontend) |

## Utility Commands

| Command | Description |
|---------|-------------|
| `/sdd:feature` | Create, select, or list features |
| `/sdd:sync` | Sync upstream IIC/kit + reapply MetodologIA brand |
| `/sdd:status` | Pipeline overview with visual table + next step advisor |
| `/sdd:verify` | Run verification suite (structure, brand, tokens, assertions) |
| `/sdd:hooks` | Install git hooks for assertion integrity |
| `/sdd:capture` | Capture session inputs into RAG memory files |
| `/sdd:memory` | Browse and search RAG memory archive |
| `/sdd:menu` | Interactive command palette |

## Experience Commands

| Command | Description |
|---------|-------------|
| `/sdd:tour` | Guided onboarding tour (8-step interactive walkthrough) |
| `/sdd:demo` | Generate demo project + open dashboard |
| `/sdd:seed` | Seed demo data without opening dashboard |

## Knowledge Graph

SDD maintains a **knowledge graph** (`.specify/knowledge-graph.json`) tracing:
- **Principles** (P-I, P-II...) from CONSTITUTION.md
- **Requirements** (FR-NNN) from spec.md
- **Tests** (TS-NNN) from .feature files
- **Tasks** (T-NNN) from tasks.md
- **Edges**: governs, verified_by, implemented_by, validates

Orphans are detected automatically: untested requirements, untraced principles, unlinked tasks.
Run `/sdd:graph` to rebuild. Dashboard Intelligence view renders it as force-directed SVG.

## Command Center (Micro-Frontend)

The dashboard is a multi-HTML system in `.specify/dashboard/`:

| Page | Views |
|------|-------|
| `index.html` | Command Center — health gauge, nav cards, activity feed |
| `pipeline.html` | Board (kanban) + Pipeline (phase dots) |
| `specs.html` | Story Map + Checklist progress |
| `quality.html` | Testify (Sankey) + Analyze + Bugs |
| `intelligence.html` | Insights (sparklines) + Graph (force-directed) + Timeline |
| `workspace.html` | Filesystem explorer + RAG memory preview |
| `governance.html` | Constitution + Principles radar |

Shared: `nav.js` (sticky navbar), `tokens.css` (design tokens), `data.js` (DASHBOARD_DATA).
Generate with: `/sdd:dashboard` or `node scripts/generate-dashboard.js <path> --multi`

## RAG Memory System

Session inputs are captured as `rag-memory-of-{slug}.md` with:
- Frontmatter: source, type, size, tags, captured timestamp
- Abstract + Key Takeaways + Relevant Insights (LLM-generated)
- Full Content: verbatim (text), structure summary (HTML), description (image), transcription (audio)

Indexed in `.specify/rag-index.json`. Visible in Workspace view.
Capture with: `/sdd:capture <file>` or `bash scripts/sdd-rag-capture.sh <file>`

## Scripts (20)

| Script | Purpose |
|--------|---------|
| `sdd-heartbeat-lite.sh` | **Per-prompt ambient heartbeat** (< 100ms, zero LLM) |
| `sdd-sentinel.sh` | Full sentinel perceive-decide-act cycle |
| `sdd-insights.js` | Health scores, traceability, risk analysis engine |
| `sdd-knowledge-graph.js` | Knowledge graph builder (Constitution→FR→TS→Tasks) |
| `sdd-seed-demo.sh` | Generate realistic demo project (3 features) |
| `sdd-rag-capture.sh` | RAG memory capture with auto-detect + indexing |
| `sdd-session-log.sh` | Session event logging (PostToolUse + PreCompact) |
| `sdd-init.sh` | Project initialization with GitHub sync |
| `sdd-status.sh` | Visual pipeline table with phase dots |
| `sdd-next-step.sh` | Next command advisor |
| `sdd-prereqs.sh` | Phase prerequisite validation |
| `sdd-feature.sh` | Create/select/list features |
| `sdd-verify.sh` | Full verification suite (7 checks) |
| `sdd-hooks-install.sh` | Git hook installation |
| `generate-dashboard.js` | Dashboard HTML generator (single + multi mode) |
| `brand-overlay.sh` | MetodologIA branding overlay |
| `brand-html-patch.js` | HTML structural patches |
| `sync-upstream.sh` | Upstream IIC/kit sync |
| `verify-brand.sh` | Brand integrity verification |
| `dashboard-template.html` | Dashboard HTML template (11 views) |

## Brand Rules

- **Body bg**: `#020617` (ultra-dark) — **Navy** `#122562` for surfaces
- **Gold** `#FFD700` — Accents, CTAs, focus, progress bars
- **Blue** `#137DC5` — Success, done, verified — **NUNCA verde**
- **Poppins** headings · **Montserrat** body · **JetBrains Mono** code
- Cards: glassmorphism `blur(16px) saturate(180%)` + `rgba(255,255,255,0.03)`
- Swiss 8px grid · Navy-tinted shadows · Neo-Swiss aesthetic

> Canonical tokens: `references/design-tokens.json` (33 colors, 4 fonts, shadows, logo SVG)
> Sequence diagrams: `references/sequence-diagrams.md` (7 Mermaid diagrams)

## Operational Vision

SDD is not just a specification framework — it's an **operational platform**. It can:
1. **Develop software**: Full pipeline from constitution to implementation
2. **Vitaminar el proceso**: Search for skills, create new ones, deploy them
3. **Execute tasks**: Via tool use and context-specific skill activation
4. **Self-monitor**: Ambient heartbeat detects drift and recommends actions
5. **Learn**: RAG memory captures session inputs for cross-session knowledge

---

## Upstream Sync

This plugin tracks `upstream/main` (IIC/kit). Only HTML/CSS branding diverges.
- Sync: `bash scripts/sync-upstream.sh`
- `.gitattributes` protects brand files during merges

---

# Intent Integrity Kit (Upstream Documentation)

**Closing the intent-to-code chasm**

## Overview

Intent Integrity Kit (IIKit) preserves your intent from idea to implementation through specification-driven development with cryptographic verification. Compatible with Claude Code, Codex, Gemini, and OpenCode.

## Skills Available

| Skill | Command | Description |
|-------|---------|-------------|
| Core | `/iikit-core` | Initialize project, check status, select feature, show help |
| Clarify | `/iikit-clarify` | Resolve ambiguities in any artifact |
| Bugfix | `/iikit-bugfix` | Report and fix bugs without full specification workflow |
| Constitution | `/iikit-00-constitution` | Create project governance principles |
| Specify | `/iikit-01-specify` | Create feature spec from description |
| Plan | `/iikit-02-plan` | Create technical implementation plan |
| Checklist | `/iikit-03-checklist` | Generate quality checklists |
| Testify | `/iikit-04-testify` | Generate test specs (TDD support) |
| Tasks | `/iikit-05-tasks` | Generate task breakdown |
| Analyze | `/iikit-06-analyze` | Validate cross-artifact consistency |
| Implement | `/iikit-07-implement` | Execute implementation |
| Tasks to Issues | `/iikit-08-taskstoissues` | Export tasks to GitHub Issues |

## Key Concepts

### Self-Validating Skills
Each skill checks its own prerequisites. Users invoke the skill they want, get feedback if prerequisites are missing.

### File-Based State
`.specify/context.json` persists state between skill invocations: current feature, available artifacts, clarification status, checklist completion.

### Multi-Feature Support
When multiple features exist in `specs/`, IIKit detects the active feature using: `.specify/active-feature` file → `SPECIFY_FEATURE` env var → Git branch → single feature auto-select.

### Cross-Agent Support
Skills stored in `.claude/skills/` with symlinks: `.codex/skills/`, `.gemini/skills/`, `.opencode/skills/`.

# Tessl Rules <!-- tessl-managed -->

@.tessl/RULES.md follow the [instructions](.tessl/RULES.md)
