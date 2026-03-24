---
description: "SDD — Generate full ALM dashboard (all generators + deploy all pages)"
user-invocable: true
---

# SDD · Dashboard

## Role
Generate the complete ALM (Application Lifecycle Manager) for the current project.
This runs ALL generators and deploys ALL visual pages to `.specify/`.

## Protocol

1. Verify `.specify/` exists (run `/sdd:init` if not)
2. Run all generators in sequence:
   ```bash
   PLUGIN="$HOME/skills/plugins/sdd-metodologia"
   PROJECT="."

   # 1. QA Plan (produces .specify/qa-plan.json + QA-PLAN.md)
   node "$PLUGIN/scripts/sdd-qa-plan.js" "$PROJECT"

   # 2. Insights (produces health snapshot in .specify/health-history.json)
   node "$PLUGIN/scripts/sdd-insights.js" "$PROJECT" --snapshot

   # 3. Knowledge Graph (produces .specify/knowledge-graph.json)
   node "$PLUGIN/scripts/sdd-knowledge-graph.js" "$PROJECT"

   # 4. Legacy dashboard (produces .specify/dashboard.html)
   node "$PLUGIN/scripts/generate-dashboard.js" "$PROJECT"

   # 5. ALM data (produces .specify/shared/data.js — reads all of the above)
   node "$PLUGIN/scripts/generate-command-center-data.js" "$PROJECT"
   ```
3. Deploy ALM pages (copy from plugin if stale or missing):
   ```bash
   # Copy all HTML pages from command-center/
   cp "$PLUGIN/scripts/command-center/"*.html ".specify/"
   # Copy shared assets
   cp "$PLUGIN/scripts/command-center/shared/"*.js ".specify/shared/"
   cp "$PLUGIN/scripts/command-center/shared/"*.css ".specify/shared/"
   ```
4. Report:
   - Pages deployed (count)
   - Health score
   - Feature count
   - Serve command: `npx serve .specify/ -p 3001`

## Output
The ALM is a multi-page micro-frontend at `.specify/`:
- `index.html` — Hub (health gauge, nav cards)
- `pipeline.html` — Pipeline + Kanban
- `specs.html` — Story map + FR drill-down
- `quality.html` — Pass rate + test pyramid + QA plan
- `intelligence.html` — Health sparkline + sentinel + risks
- `logs.html` — Unified log viewer (session, changelog, tasklog, ADRs)
- `backlog.html` — Feature backlog board
- `workspace.html` — File explorer + RAG memory
- `governance.html` — Constitution + quality gates + DoD
- `search.html` — Global cross-artifact search
- `tour.html` — 8-step onboarding
- `docs.html` — Documentation links

## Design System
- **Tokens**: `references/design-tokens.json` (canonical source)
- Body: ultra-dark #020617, glassmorphism cards, gold accents
- Blue #137DC5 for done/verified (NEVER green)
- Poppins headings, Montserrat body, JetBrains Mono code
