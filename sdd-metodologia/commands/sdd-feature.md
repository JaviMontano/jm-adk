---
description: "SDD — Create, select, or list features in the pipeline"
user-invocable: true
---

# /sdd:feature

Manage features in the SDD pipeline.

## Execution

### Subcommand: new / create
```bash
bash scripts/sdd-feature.sh new "Feature description" .
```

### Subcommand: use / select
```bash
bash scripts/sdd-feature.sh use <selector> .
```
Selector: number (1), partial name (auth), or full dir name (001-user-auth).

### Subcommand: list (default)
```bash
bash scripts/sdd-feature.sh list .
```
