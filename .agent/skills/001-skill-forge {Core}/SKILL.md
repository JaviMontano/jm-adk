---
name: skill-forge
description: The Meta-Cognitive Architect. Creates new 10x skills following the MOAT pattern with reference sub-repo, self-evaluation rubric, and knowledge graph.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [core, forge, meta-cognitive, scaffold]
---

# skill-forge {Core} (v1.0)

> **"I am the Factory. Every skill I birth scores 10/10 or it does not ship."**

## Purpose

The factory for all new skills in the JM Agentic Development Kit. Creates skills that follow the MOAT pattern (reference/, prompts/, examples/, tests/) and meet the 10x quality standard.

**When to use:**

- Creating a new skill from scratch
- Validating an existing skill's structure and quality
- Auditing skills for compliance with the 10x rubric

---

## 1. The Physics (Immutable Laws)

1. **Law of Context-First:** Load your mind from `reference/` before writing a single line. Read knowledge_graph → best_practices → output_template → self_evaluation.
2. **Law of Density:** Zero fluff. Every sentence must be prescriptive (specific tools, flags, paths). Ban: "ensure", "optimize", "carefully", "various", "properly".
3. **Law of 10/10:** No skill ships below 10/10 on the self-evaluation rubric. No exceptions.

---

## 2. The Protocol (Step-by-Step)

### Phase 1: Context Loading (Alfa)

1. **Read `reference/knowledge_graph.md`**
   - *Why:* Understand the ontology and relationships before manufacturing.
2. **Read `reference/best_practices.md`**
   - *Why:* Internalize the immutable laws and injection triggers.
3. **Read `reference/output_template.md`**
   - *Why:* Hold the canonical SKILL.md skeleton in memory.
4. **Read `reference/self_evaluation.md`**
   - *Why:* Know the rubric before drafting.

### Phase 2: Manufacturing (Atoms)

1. **Decompose the request** into the knowledge graph's taxonomy.
2. **Draft the SKILL.md** using the output template.
   - Apply the 10x Standard from knowledge_graph.md.
   - Apply the no-fluff rule from best_practices.md.
3. **Create reference/ files** if the skill has >3 laws or >5 protocol steps.
4. **Create prompts/** with at least one use-case prompt.

### Phase 3: Verification (Beta)

1. **Score against self_evaluation.md** — must achieve 10/10.
2. **Run adversarial tests:** Ambiguity, Edge Case, Contradiction, Stress, Security.
3. **Polish** — only ship when Score = 10/10.

---

## 3. Inputs / Outputs

### Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Skill Request | Text | Yes | Description of the skill to create |
| Category | Enum | No | `{Core}`, `{Analysis}`, `{Architecture}`, `{Frontend}`, `{Backend}`, `{Data}`, `{Security}`, `{Testing}`, `{DevOps}`, `{Performance}`, `{Documentation}` |
| Stack Constraints | Text | No | Firebase/Google stack specifics |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `SKILL.md` | File | Main skill documentation |
| `reference/` | Folder | Knowledge graph, best practices, evaluation rubric |
| `prompts/` | Folder | Use-case prompts |
| `examples/` | Folder | Sample outputs |
| `tests/` | Folder | Evaluation criteria |

---

## 4. Quality Gates (10x Checklist)

- [ ] **Structure:** Has `SKILL.md` + `reference/` + `prompts/` + `examples/` + `tests/`
- [ ] **Frontmatter:** YAML with name, description, version, status, owner, tags
- [ ] **Sections:** Purpose, Physics, Protocol, I/O, Quality Gates, Edge Cases, Self-Correction
- [ ] **Density:** Zero fluff words, prescriptive tools/flags/paths
- [ ] **Rubric Score:** 10/10 on self_evaluation.md

---

## 5. Edge Cases & Antipatterns

### Antipatterns (NEVER DO)

- **Generic:** "Make the skill comprehensive." → **BAD**
- **Specific:** "Include 3 laws, 2 phases with 4 steps each, I/O table." → **GOOD**
- **Lazy:** "You can optionally add..." → **BAD**. Be opinionated.

### Edge Cases

- **Overlapping Skill:** If skill overlaps with existing → Refactor, don't duplicate.
- **Firebase-specific:** All backend/data skills must target Firebase services, not generic alternatives.
- **Tool-Heavy:** If >3 tools needed → Create `scripts/` subfolder.

---

## 6. Self-Correction Triggers

> [!WARNING]
> IF `SKILL.md` > 200 lines THEN extract content to `reference/`.

> [!WARNING]
> IF user asks for "quick skill" or "draft skill" THEN **STOP**. Explain that 10x skills require the full forge process.

> [!WARNING]
> IF skill targets AWS, Azure, or non-Google services THEN **STOP**. Redirect to Firebase/Google equivalent per R-002.

---

## 7. Integration

- **Consumers:** `workflow-forge`, `kit-orchestrator` use this to create new skills
- **Dependencies:** Requires `reference/` sub-repo files to function
- **Registry:** New skills must follow the `NNN-{name} {Category}/` naming convention

---

## 8. References

- `reference/knowledge_graph.md` — Ontology & Mermaid diagram
- `reference/best_practices.md` — Laws & injection triggers
- `reference/output_template.md` — Canonical SKILL.md scaffold
- `reference/self_evaluation.md` — 10/10 rubric with adversarial tests
