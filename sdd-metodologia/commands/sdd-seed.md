---
description: "SDD — Seed demo data without opening dashboard"
user-invocable: true
---

# /sdd:seed — Seed Demo Data

Alias for `/sdd:demo` that generates demo data only (no dashboard open).

## Usage
```
/sdd:seed              # Generate at /tmp/sdd-demo
/sdd:seed <path>       # Generate at custom path
```

## Execution
Delegates to: `bash scripts/sdd-seed-demo.sh <path>`
