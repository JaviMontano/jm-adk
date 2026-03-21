---
name: meta-skill-searcher
description: BM25 search over the skills catalog. Finds relevant skills by keyword, domain, or capability. Uses skills_index.json.
version: 1.0.0
status: production
owner: Javier Montano
tags: [meta, search, bm25, discovery]
---

# meta-skill-searcher {Meta} (v1.0)

> **"Skills that create, review, search, and deploy other skills."**

## Purpose
Skill discovery engine. Searches the skills_index.json catalog using BM25 ranking algorithm.

**When to use:** `/jm:search-skill "firebase auth"` or when routing needs skill matching.

## 1. The Physics
1. **Law of Index:** Always search skills_index.json, never scan directories directly.
2. **Law of Ranking:** BM25 scoring: term frequency, inverse document frequency, document length normalization.
3. **Law of Domain:** Filter by domain: core, analysis, architecture, frontend, backend, data, security, testing, devops, performance, documentation, meta, iic.

## 2. The Protocol
### Phase 1: Parse search query + optional domain filter.
### Phase 2: Load skills_index.json, run BM25 ranking.
### Phase 3: Return top 5 results with scores and descriptions.

## 3. Quality Gates
- [ ] Operation completed successfully
- [ ] skills_index.json updated if needed
- [ ] context.json reflects current state
- [ ] No stack violations (R-002, R-003)

## 4. Self-Correction Triggers
> [!WARNING]
> IF skills_index.json is stale THEN regenerate before searching.
> IF deploying a skill with status != production THEN WARN user.
