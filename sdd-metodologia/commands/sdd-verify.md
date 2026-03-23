---
description: "SDD — Run verification suite (structure, brand, tokens, assertions)"
user-invocable: true
---

# /sdd:verify

Run the SDD verification suite against the current project.

## Execution

### Full verification
```bash
bash scripts/sdd-verify.sh .
```

### Quick verification (skip feature-level checks)
```bash
bash scripts/sdd-verify.sh . --quick
```

Checks: project structure, brand integrity, design tokens, dashboard template, feature artifacts, assertion integrity, plugin structure.
