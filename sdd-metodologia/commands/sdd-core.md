---
description: "SDD — Project init, status, feature selection, workflow help"
user-invocable: true
---

# /sdd:core

Initialize project, check status, select active feature, or show help.

## Execution

### Subcommand: init
1. Run `bash scripts/sdd-init.sh .` to initialize with MetodologIA branding
2. Then run the skill at `.claude/skills/iikit-core/SKILL.md` with `init`
3. Show the branded next steps from the init script output

### Subcommand: status
1. Run `bash scripts/sdd-status.sh .` for visual pipeline table
2. Run `bash scripts/sdd-next-step.sh .` for next recommended action

### Subcommand: use / select
Run the skill at `.claude/skills/iikit-core/SKILL.md` with the user's input.

### Subcommand: help
Display the output of `/sdd:menu` command.

### Default (no subcommand)
Run `bash scripts/sdd-status.sh .` then `bash scripts/sdd-next-step.sh .`
