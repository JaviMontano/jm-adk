---
name: context-optimizer
description: Manages token budget across sessions. Implements lazy loading, context compression, and progressive disclosure to maximize effective context usage.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [core, context, optimization, token-budget]
---

# context-optimizer {Core} (v1.0)

> **"Load what you need, when you need it. Never the whole library."**

## Purpose

Prevents context window saturation by managing what gets loaded and when. Implements lazy loading of skill references, progressive disclosure of large artifacts, and context compression for long sessions.

**When to use:**

- Automatically during skill loading (implicit)
- When session approaches context limits
- When `/jm:optimize-ctx` is invoked

---

## 1. The Physics (Immutable Laws)

1. **Law of Lazy Loading:** Never load a skill's full reference/ until the skill is actively executing.
2. **Law of Compression:** Summaries first, details on demand. Show the index, not the book.
3. **Law of Eviction:** Completed phase artifacts can be summarized to free context for active work.

---

## 2. The Protocol (Step-by-Step)

### Phase 1: Budget Assessment

1. **Estimate current context usage** (messages, loaded files, skill references).
2. **Identify candidates for eviction** — completed phases, resolved clarifications.
3. **Prioritize active work** — current phase gets full context, others get summaries.

### Phase 2: Optimization Actions

1. **Compress completed artifacts:** Replace full analysis with 5-line summary.
2. **Defer reference loading:** Load skill SKILL.md first; load reference/ only when protocol demands it.
3. **Index-first pattern:** Show skill catalog index before loading individual skills.

---

## 3. Inputs / Outputs

### Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Current context | State | Yes | Active session state |
| Active phase | Enum | Yes | Current pipeline phase |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| Optimized context | State | Compressed session state |
| Eviction report | Text | What was compressed and why |

---

## 4. Quality Gates (10x Checklist)

- [ ] **Active phase** has full context loaded
- [ ] **Completed phases** are summarized (not deleted)
- [ ] **No skill reference** loaded before its skill is active
- [ ] **Index available** for skill discovery without full loading

---

## 5. Self-Correction Triggers

> [!WARNING]
> IF loading a reference/ file that isn't for the active skill THEN **DEFER**. Load only when the skill executes.
