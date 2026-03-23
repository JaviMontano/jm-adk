---
description: "SDD — Install git hooks for assertion integrity verification"
user-invocable: true
---

# /sdd:hooks

Install SDD git hooks for cryptographic assertion integrity.

## Execution
```bash
bash scripts/sdd-hooks-install.sh .
```

Installs pre-commit (validates .feature hashes) and post-commit (stores assertion hashes as git notes) hooks.
