---
name: output-contract-enforcer
description: Validates that every skill output matches its declared contract (format, completeness, evidence tags). Rejects non-conformant outputs.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [core, validation, contracts, output]
---

# output-contract-enforcer {Core} (v1.0)

> **"If the contract says 5 sections, I count 5 sections. Not 4. Not 6."**

## Purpose

Post-execution validator that checks every skill's output against its declared Inputs/Outputs table. Verifies format compliance (markdown structure, evidence tags, naming conventions) and completeness (all required sections present).

**When to use:**

- After every skill execution (implicit validation)
- Before gate evaluation (pre-gate check)
- When `/jm:verify` is invoked

---

## 1. The Physics (Immutable Laws)

1. **Law of Contract:** Every skill declares its outputs in the I/O table. The output MUST match.
2. **Law of Evidence:** Analysis outputs MUST contain evidence tags. No tags = contract violation.
3. **Law of Naming:** Files follow conventions: kebab-case for files, PascalCase for components, camelCase for functions.

---

## 2. The Protocol (Step-by-Step)

### Phase 1: Contract Loading

1. **Read the skill's SKILL.md** Outputs table.
2. **Extract expected outputs:** file type, name pattern, required sections.

### Phase 2: Validation

1. **Check existence:** Does the output file exist?
2. **Check format:** Does it match the declared type (Markdown, JSON, HTML, etc.)?
3. **Check sections:** For Markdown outputs, are all required sections present?
4. **Check evidence tags:** For analysis outputs, are `[CODE]`/`[CONFIG]`/`[DOC]`/`[INFERENCE]`/`[ASSUMPTION]` present?
5. **Check naming:** Does the file follow naming conventions (R-008)?

### Phase 3: Verdict

1. **Pass:** Output matches contract → proceed.
2. **Fail:** List specific violations → block until fixed.

---

## 3. Inputs / Outputs

### Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Skill SKILL.md | File | Yes | The skill definition with I/O table |
| Generated output | File(s) | Yes | The output to validate |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| Validation report | Text | Pass/fail per check with specifics |

---

## 4. Quality Gates (10x Checklist)

- [ ] **Contract loaded** from skill's I/O table
- [ ] **All declared outputs** exist
- [ ] **Format matches** declared type
- [ ] **Evidence tags present** in analysis outputs
- [ ] **Naming conventions** followed (R-008)

---

## 5. Self-Correction Triggers

> [!WARNING]
> IF output has zero evidence tags but skill is in analysis category THEN **FAIL**. Evidence tags are mandatory for analysis.

> [!WARNING]
> IF output file uses wrong naming convention THEN auto-suggest the correct name but don't rename without user approval.
