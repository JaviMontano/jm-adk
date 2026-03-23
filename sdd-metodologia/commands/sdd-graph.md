---
description: "SDD — Build knowledge graph (Constitution→FR→TS→Tasks traceability)"
user-invocable: true
---

# /sdd:graph — Knowledge Graph Builder

Build the SDD knowledge graph from project artifacts.

## What it does
1. Parses CONSTITUTION.md → extracts principles as nodes
2. Parses spec.md files → extracts FR-NNN, US-NNN, SC-NNN
3. Parses .feature files → extracts TS-NNN with @FR/@US tags
4. Parses tasks.md → extracts T-NNN with FR references
5. Builds edges: governs, verified_by, implemented_by, validates
6. Detects orphans: untested requirements, untraced principles, unlinked tasks
7. Writes `.specify/knowledge-graph.json`

## Usage
```
/sdd:graph              # Build graph for current project
/sdd:graph --json       # Also print JSON to stdout
```

## Execution
```bash
node scripts/sdd-knowledge-graph.js <project-path>
```

Then report the summary: nodes, edges, orphans, coverage %.
If orphans are found, recommend the appropriate /sdd: command to fix them.
