---
name: iic-implement
description: Red-green-verify implementation cycle. Verifies hash integrity of .feature files. NEVER modifies test assertions. Enforces coverage.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [metacognition, integrity, implementation, tdd]
---

# iic-implement {Metacognition} (v1.0)

> **"Tests are sacred. Code bends to tests, never the reverse."**

## Purpose
Guides implementation following red-green-verify TDD cycle. Verifies SHA256 hash integrity of .feature files before coding. Blocks any attempt to modify test assertions.

**When to use:**
- After tasks.md is approved (post-G2)
- During active development phase

---

## 1. The Physics
1. **Law of Hash Integrity:** Before coding, verify .feature file hashes match context.json. Mismatch = STOP.
2. **Law of Red-Green:** Write code to pass existing tests. NEVER modify tests to match code.
3. **Law of Coverage:** 100% of .feature scenarios must have passing step implementations.

## 2. The Protocol
### Phase 1: Pre-Implementation
1. Verify .feature hash integrity against context.json.
2. Read tasks.md for current task [T###].
3. Confirm task has US-X link and corresponding .feature scenarios.

### Phase 2: Red-Green-Verify
1. **RED:** Run tests — confirm they fail (expected).
2. **GREEN:** Write minimal code to pass tests.
3. **VERIFY:** Run full test suite — all green.
4. Repeat for next task.

### Phase 3: Progress Update
1. Update context.json stage: `implementing-NN%`.
2. Mark completed tasks in tasks.md: `- [x] [T###]`.

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| tasks.md | File | Yes | Task to implement |
| *.feature files | Gherkin | Yes | Hash-locked tests |
| context.json | JSON | Yes | Hash verification |

| Output | Type | Description |
|--------|------|-------------|
| Source code | Files | Implementation |
| context.json update | JSON | Progress percentage |

## 4. Quality Gates
- [ ] Hash integrity verified before coding
- [ ] No .feature files modified
- [ ] All tests pass after implementation
- [ ] Coverage 100% of scenarios
- [ ] context.json progress updated

## 5. Self-Correction Triggers
> [!WARNING]
> IF .feature hash mismatch THEN **STOP**. Do not code. Report integrity violation.

> [!WARNING]
> IF test modified to pass THEN **REVERT**. Fix code, not tests.
