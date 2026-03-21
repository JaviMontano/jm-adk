---
name: iic-testify
description: Generates Gherkin .feature files from spec.md. SHA256 hash-locks assertions BEFORE implementation. Prevents silent requirement drift.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [metacognition, integrity, testing, bdd]
---

# iic-testify {Metacognition} (v1.0)

> **"Tests are written from specs, not from code. Hash-locked, immutable until re-specified."**

## Purpose
Transforms spec.md requirements into Gherkin .feature files. Computes SHA256 hashes for each feature file and stores them in context.json. These hashes LOCK assertions before implementation begins.

**When to use:**
- After spec.md is approved
- Before implementation starts
- When TDD flag is true in context.json

---

## 1. The Physics
1. **Law of Spec-First:** .feature files generated from spec.md FR-XXX/US-X/SC-XXX. NEVER from code.
2. **Law of Hash-Lock:** SHA256 hash computed and stored in context.json BEFORE implementation.
3. **Law of Immutability:** Modifying .feature files during implementation is BLOCKED. Change spec → re-testify → re-hash.

## 2. The Protocol
### Phase 1: Parse Spec
1. Extract FR-XXX, US-X, SC-XXX from spec.md.
2. Map each to Gherkin scenarios (Given/When/Then).

### Phase 2: Generate Features
1. Write `specs/{feature}/tests/features/*.feature` files.
2. Tag with `@FR-001`, `@US-1`, `@SC-001`.
3. Include `# DO NOT MODIFY — hash-locked` header.

### Phase 3: Hash-Lock
1. Compute SHA256 for each .feature file.
2. Store in `.specify/context.json` assertions object.
3. Format: `{ "file": "hash" }`

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| spec.md | File | Yes | Source requirements |

| Output | Type | Description |
|--------|------|-------------|
| *.feature files | Gherkin | Hash-locked test scenarios |
| context.json update | JSON | SHA256 hashes stored |

## 4. Quality Gates
- [ ] Every FR-XXX has at least one scenario
- [ ] All features tagged with spec IDs
- [ ] SHA256 hashes stored in context.json
- [ ] DO NOT MODIFY header present
- [ ] No implementation details in feature files

## 5. Self-Correction Triggers
> [!WARNING]
> IF .feature file modified during implementation THEN **BLOCK**. Re-specify first.
