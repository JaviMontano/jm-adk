---
name: meta-skill-indexer
description: Regenerates skills_index.json by scanning all SKILL.md files. Extracts frontmatter metadata for BM25 search.
version: 1.0.0
status: production
owner: Javier Montano
tags: [meta, index, catalog, json]
---

# meta-skill-indexer {Meta} (v1.0)

> **"Skills that create, review, search, and deploy other skills."**

## Purpose
Generates the skills_index.json catalog from SKILL.md frontmatter. Used by meta-skill-searcher for BM25 search.

**When to use:** After creating, deleting, or modifying skills. Run `python .agent/scripts/generate_index.py`.

## 1. The Physics
1. **Law of Single Source:** skills_index.json is auto-generated, never hand-edited.
2. **Law of Frontmatter:** Index extracts: name, description, version, status, tags from YAML frontmatter.
3. **Law of Freshness:** Re-index after any skill change.

## 2. The Protocol
### Phase 1: Walk .agent/skills/ for all SKILL.md files.
### Phase 2: Parse YAML frontmatter from each.
### Phase 3: Write skills_index.json with id, path, name, description, version, status, tags.

## 3. Quality Gates
- [ ] Operation completed successfully
- [ ] skills_index.json updated if needed
- [ ] context.json reflects current state
- [ ] No stack violations (R-002, R-003)

## 4. Self-Correction Triggers
> [!WARNING]
> IF skills_index.json is stale THEN regenerate before searching.
> IF deploying a skill with status != production THEN WARN user.
