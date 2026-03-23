---
description: "SDD — Generate demo project with realistic data and open dashboard"
user-invocable: true
---

# /sdd:demo — Demo Mode

Generate a complete SDD demo project with realistic EdTech quiz app data, then open the dashboard.

## What it creates
- CONSTITUTION.md with 5 principles
- PREMISE.md (EdTech quiz platform)
- 3 features at different pipeline phases:
  - 001-auth (Phase 7 — implementing, 10/15 tasks done)
  - 002-quiz (Phase 4 — testing, no BDD scenarios yet)
  - 003-analytics (Phase 1 — just specified)
- Health history (10 snapshots, score trending 35→82)
- Sentinel findings (2 active: stale checklist, zero coverage)
- Knowledge graph orphans (3: untested FR, untraced principle, unlinked task)
- RAG memory (1 brand-guide example)
- Session log (20 events)

## Usage
```
/sdd:demo              # Generate at /tmp/sdd-demo and open dashboard
/sdd:seed              # Just generate data, don't open dashboard
/sdd:seed <path>       # Generate at custom path
```

## Execution
```bash
bash scripts/sdd-seed-demo.sh /tmp/sdd-demo
node scripts/sdd-knowledge-graph.js /tmp/sdd-demo
node scripts/generate-dashboard.js /tmp/sdd-demo
# Open .specify/dashboard.html in browser
```
