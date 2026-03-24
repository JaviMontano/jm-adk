# SDD State Architecture — JSON Files & Data Flow

> How SDD reads the local project, stores state, and feeds the ALM dashboard.

## Data Flow

```
Project Files (local repo)
    │
    ├── CONSTITUTION.md ──────┐
    ├── PREMISE.md ───────────┤
    ├── tasklog.md ───────────┤
    ├── changelog.md ─────────┤
    ├── decision-log.md ──────┤
    ├── backlog.md ───────────┤
    ├── specs/                 │
    │   └── {feature}/         │
    │       ├── spec.md ───────┤
    │       ├── plan.md ───────┤
    │       ├── tasks.md ──────┤
    │       ├── analysis.md ───┤
    │       ├── checklist.md ──┤
    │       └── tests/         │
    │           └── *.feature ─┤
    │                          ▼
    │              ┌──────────────────────┐
    │              │   GENERATORS (Node)   │
    │              │                       │
    │              │ sdd-qa-plan.js ──→ qa-plan.json
    │              │ sdd-insights.js ──→ health-history.json
    │              │ sdd-knowledge-graph.js → knowledge-graph.json
    │              │ generate-dashboard.js → dashboard.html
    │              │ generate-cc-data.js ──→ shared/data.js
    │              └──────────────────────┘
    │                          │
    │                          ▼
    └── .specify/
        ├── context.json          ← Pipeline state (current feature, phase)
        ├── sentinel-state.json   ← Heartbeat state (lastRun, findings)
        ├── health-history.json   ← Score history array (date, score)
        ├── knowledge-graph.json  ← Traceability graph (nodes, edges)
        ├── qa-plan.json          ← QA plan (DoD, gates, feature quality)
        ├── session-log.json      ← Event log (type, timestamp, description)
        ├── rag-index.json        ← RAG memory index
        ├── backlog.json          ← (optional) Backlog items
        │
        ├── shared/
        │   └── data.js           ← window.DASHBOARD_DATA (ALL above merged)
        │
        └── *.html                ← ALM pages (read data.js)
```

## JSON State Files

### context.json
Created by: `sdd-init.sh`
Updated by: `sdd-feature.sh`, skill scripts
Read by: ALL scripts (feature detection, phase tracking)

```json
{
  "currentFeature": "001-auth",
  "features": { "001-auth": { "phase": "deliver" } },
  "lastUpdated": "2026-03-24T10:00:00Z"
}
```

### sentinel-state.json
Created by: `sdd-sentinel.sh`
Updated by: `sdd-heartbeat-lite.sh`
Read by: `generate-command-center-data.js`

```json
{
  "lastRun": "2026-03-24T10:05:00Z",
  "runCount": 42,
  "suppressedUntil": null,
  "findings": [],
  "healthScore": 87,
  "enabled": true
}
```

### health-history.json
Created by: `sdd-insights.js --snapshot`
Read by: `generate-command-center-data.js` → intelligence.html sparkline

```json
[
  { "date": "2026-03-20", "score": 65 },
  { "date": "2026-03-21", "score": 72 },
  { "date": "2026-03-24", "score": 87 }
]
```

### knowledge-graph.json
Created by: `sdd-knowledge-graph.js`
Read by: `generate-command-center-data.js` → intelligence.html

```json
{
  "nodes": [
    { "id": "P-I", "type": "principle", "label": "Skills-First" },
    { "id": "FR-001", "type": "requirement", "label": "Email registration" },
    { "id": "TS-001", "type": "test", "label": "Register with valid email" }
  ],
  "edges": [
    { "source": "P-I", "target": "FR-001", "relation": "governs" },
    { "source": "FR-001", "target": "TS-001", "relation": "verified_by" }
  ],
  "orphans": ["FR-019"]
}
```

### qa-plan.json
Created by: `sdd-qa-plan.js`
Read by: `generate-command-center-data.js` → quality.html + governance.html

```json
{
  "dod": [
    { "phase": "User Specs", "criterion": "All FR have SC", "target": "100%", "status": "passed" }
  ],
  "globalAC": { "total": 15, "met": 12, "coverage": 80 },
  "featureQuality": [...],
  "subArtifacts": [...]
}
```

### session-log.json
Created by: `sdd-session-log.sh`
Read by: `generate-command-center-data.js` → logs.html + index.html

```json
{
  "events": [
    { "type": "write", "timestamp": "2026-03-24T10:00:00Z", "description": "Edited spec.md" }
  ]
}
```

### shared/data.js
Created by: `generate-command-center-data.js`
Read by: ALL ALM HTML pages via `<script src="shared/data.js">`

This is the **single source of truth** for the entire ALM dashboard.
It merges ALL the above JSON files + parsed markdown into one `window.DASHBOARD_DATA` object.

## Filesystem Scanning

The generator dynamically scans the local project:

1. **specs/** — Feature directories (each with spec.md, plan.md, tasks.md, etc.)
2. **.specify/** — State JSON files (context, sentinel, health, etc.)
3. **workspace/** — User interaction files (if exists)
4. **Root governance** — CONSTITUTION.md, PREMISE.md, tasklog.md, changelog.md, decision-log.md
5. **RAG memory** — .specify/rag-memory/rag-memory-of-*.md files

Depth limit: 3 levels. File limit: 50 per directory. Hidden files/dirs excluded.

## Refresh Cycle

| Trigger | What runs | What updates |
|---------|-----------|-------------|
| `/sdd:init` | ALL generators | ALL state files + ALM pages |
| `/sdd:dashboard` | ALL generators | ALL state files + data.js |
| `/sdd:sentinel` | sentinel only | sentinel-state.json |
| `/sdd:insights` | insights only | health-history.json |
| `/sdd:qa` | qa-plan only | qa-plan.json |
| `/sdd:graph` | knowledge-graph only | knowledge-graph.json |
| Heartbeat (per-prompt) | heartbeat-lite.sh | sentinel-state.json (if findings) |
| PostToolUse hook | session-log.sh | session-log.json |
