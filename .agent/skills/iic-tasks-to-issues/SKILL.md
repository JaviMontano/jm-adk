---
name: iic-tasks-to-issues
description: Converts tasks.md entries to GitHub Issues via gh CLI. Links to spec IDs. Tracks in context.json.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [metacognition, integrity, github, issues]
---

# iic-tasks-to-issues {Metacognition} (v1.0)

> **"Every task deserves a home in the issue tracker."**

## Purpose
Converts tasks.md task entries into GitHub Issues using the `gh` CLI. Each issue links back to spec IDs (FR-XXX, US-X). Tracks issue numbers in context.json.

**When to use:**
- After tasks.md is finalized
- When team collaboration requires issue tracking

---

## 1. The Physics
1. **Law of Mapping:** One task [T###] = one GitHub Issue.
2. **Law of Linkage:** Issue body includes FR-XXX/US-X references from tasks.md.
3. **Law of Labels:** Parallelizable [P] tasks get "parallelizable" label.

## 2. The Protocol
### Phase 1: Parse Tasks
1. Read tasks.md for all `- [ ] [T###]` entries.
2. Extract description, US-X link, [P] flag.

### Phase 2: Create Issues
1. `gh issue create --title "[T###] {description}" --body "Linked: US-X, FR-XXX"`.
2. Add labels: priority, parallelizable, category.
3. Record issue number in context.json.

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| tasks.md | File | Yes | Task list |

| Output | Type | Description |
|--------|------|-------------|
| GitHub Issues | Remote | Created issues |
| context.json update | JSON | Issue number mapping |

## 4. Quality Gates
- [ ] All tasks converted to issues
- [ ] Issues link to spec IDs
- [ ] Issue numbers tracked in context.json
