<!--
SYNC IMPACT REPORT
Version: 1.0.0 -> 2.0.0
Change Type: MAJOR
Modified Principles: IV (Phase Separation — renamed phases)
Added Sections: VI (Definition of Done), VII (Operational Logs),
  VIII (Session Protocol), Pipeline Phase Reference
Removed Sections: None
Follow-up TODOs: Update all skill SKILL.md files with new phase names
-->

# SDD Constitution — Spec Driven Development

> SDD by MetodologIA — Specification-driven development with
> cryptographic BDD verification and ambient intelligence.
> This constitution governs the SDD plugin and every project that adopts it.

---

## Core Principles

### I. Skills-First

All functionality MUST be delivered as AI agent skills.
Skills are the primary interface for users; scripts and
utilities exist only to support skill execution.

- Every user-facing capability MUST have a corresponding skill
- Skills MUST be self-contained with clear inputs and outputs
- Supporting scripts MUST be invocable from skills, not used directly

**Rationale**: Users interact with AI agents, not command lines.

### II. Multi-Agent Compatibility

Skills MUST work across multiple AI coding assistants without modification.

- Primary source of truth: `.claude/skills/`
- Other agents use symlinks to the primary location
- Skill instructions MUST NOT use agent-specific features

**Rationale**: Users choose their AI assistant; the framework
should not lock them into a specific tool.

### III. Cross-Platform Parity

Every script MUST have equivalent implementations for both Unix and Windows.

- Both implementations MUST produce identical outputs for identical inputs
- New script functionality MUST NOT be merged without both platform implementations
- Bash 3.2 compatibility required (macOS default)

**Rationale**: Development teams use mixed environments.

### IV. Phase Separation (NON-NEGOTIABLE)

The SDD pipeline has **9 ordered phases**. Each phase produces a specific
artifact. Phases MUST NOT be skipped without explicit justification.

| # | Phase | Artifact | Description |
|---|-------|----------|-------------|
| 0 | **Constitution** | `CONSTITUTION.md` | Governance — **3 sources**: (a) base system principles, (b) user Phase 0 requests, (c) principles derived from user specs analysis |
| 1 | **User Specs** | `spec.md` | User stories, functional requirements (FR), success criteria (SC) from natural language |
| 2 | **Technical Specs** | `plan.md` | Architecture, data model, API contracts, technology decisions |
| 3 | **BDD Analysis** | `checklist.md` | Quality checklists — requirements completeness, not implementation |
| 4 | **Test** | `*.feature` | Gherkin BDD scenarios with cryptographic assertion hashing |
| 5 | **Task** | `tasks.md` | Dependency-ordered, parallelism-marked task breakdown |
| 6 | **Organize Plan** | `analysis.md` | Cross-artifact consistency validation — traceability FR→TS→T |
| 7 | **Deliver** | code | Iterative TDD implementation — red/green/refactor per task |
| 8 | **Ship** | issues | Export to GitHub Issues, deploy, close loop |

**Quality Gates** interrupt the flow at critical points:
- **G1** after Technical Specs (Phase 2) — architecture approved?
- **G2** after Organize Plan (Phase 6) — cross-artifact consistent?
- **G3** after Deliver (Phase 7) — tests pass, ready to ship?

**Phase rules:**
- Constitution (WHY) > User Specs (WHAT) > Technical Specs (HOW) > BDD (PROOF) > Tasks (WORK) > Code (SOLUTION)
- Each phase produces exactly ONE artifact type
- Artifacts are immutable once the next phase begins (amend via `/sdd:clarify`)
- Skills validate phase boundaries and reject violations

**Rationale**: Clean separation enables independent evolution of
governance, requirements, and implementation without cascading changes.

### V. Self-Validating Skills

Each skill MUST check its own prerequisites before execution.

- Skills MUST NOT assume previous phases completed
- Missing prerequisites produce clear error messages with remediation steps
- Skills MUST NOT proceed with partial or invalid inputs

**Rationale**: Users invoke skills directly; each skill must stand
alone in validating its execution context.

---

## VI. Definition of Done

A **request** (feature, bugfix, or improvement) is DONE when ALL of the following are true:

### Per-Phase DoD

| Phase | Done When |
|-------|-----------|
| User Specs | FR-NNN, US-NNN, SC-NNN defined. Clarifications resolved. No [ASSUMPTION] > 30% |
| Technical Specs | Data model, API contracts, component list documented. Gate G1 passed |
| BDD Analysis | Checklist 100% checked. Requirements-quality validated (not implementation) |
| Test | Gherkin scenarios generated. Hash-locked. Traceability: every FR has ≥1 TS |
| Task | All tasks T-NNN ordered by dependency. Parallel markers applied. Estimates present |
| Organize Plan | Cross-artifact analysis score ≥ 95%. Zero HIGH/CRITICAL conflicts. Gate G2 passed |
| Deliver | All tests green. Zero regressions. Code reviewed. Gate G3 passed |
| Ship | Issues exported. Deployed to target. Changelog updated. Feature closed in pipeline |

### Request-Level DoD

A request is **fully done** when:
1. All 8 phase DoDs are satisfied
2. `tasklog.md` entry moved to `## Completed`
3. `changelog.md` entry recorded with date, type, and constitutional principles
4. `decision-log.md` updated if any Socratic debates occurred
5. Knowledge graph rebuilt (`/sdd:graph`) — zero new orphans introduced
6. Health score ≥ previous score (no regression)
7. Sentinel run clean (zero findings related to this request)

### Evidence Tags

Every claim in any artifact MUST be tagged:
- `[CODE]` — verified in source code
- `[CONFIG]` — verified in configuration files
- `[DOC]` — verified in documentation
- `[INFERENCE]` — logical deduction from evidence
- `[ASSUMPTION]` — unverified, requires validation

If > 30% of claims in a deliverable are `[ASSUMPTION]`, the deliverable
MUST display a prominent warning and trigger clarification before proceeding.

---

## VII. Operational Logs

SDD maintains **4 operational logs** for cross-session continuity.
These are living documents in the project root, NOT in `.specify/`.

### tasklog.md

Tracks open work items that span sessions.

```markdown
| ID | Task | Status | Owner | Opened | Notes |
|----|------|--------|-------|--------|-------|
```

**Statuses**: `open`, `in-progress`, `blocked`, `deferred`
**Rules**:
- Items > 14 days without progress MUST be reviewed
- Completed items move to `## Completed` (retained 30 days)
- Session protocol reviews this at every session start
- Every `/sdd:spec` creates a tasklog entry automatically
- Every `/sdd:impl` completion moves the entry to Completed

### changelog.md

Records significant decisions, completions, and changes.

```markdown
## YYYY-MM-DD
- **[type]**: description — rationale [Principle X, Y]
```

**Types**: `decision`, `completion`, `amendment`, `insight`, `blocker`, `discovery`
**Rules**:
- Every gate passage (G1, G2, G3) creates a changelog entry
- Every constitution amendment creates a changelog entry
- Every feature completion creates a changelog entry
- Entries reference constitutional principles involved

### decision-log.md

Records decisions made via Socratic debate or explicit choice.

```markdown
## DEC-NNN: Title
- **Date**: YYYY-MM-DD
- **Context**: Why this decision was needed
- **Options**: What was considered
- **Decision**: What was chosen
- **Rationale**: Why (reference constitutional principles)
- **Consequences**: What this enables/prevents
```

**Rules**:
- Any decision with 2+ options with divergent consequences MUST be logged
- Decisions are immutable — superseded decisions reference the replacement
- Before debating: check decision-log for existing patterns

### session-log.json

Automated event log maintained by hooks (PostToolUse, PreCompact).
Machine-readable. Located in `.specify/session-log.json`.

**Rules**:
- Capped at 200 events (FIFO)
- Auto-populated by hooks — no manual entries
- Used by sentinel and insights for activity analysis

---

## VIII. Session Protocol

Every new session MUST follow this initialization sequence:

1. **Context Loading** — Read CONSTITUTION.md, then project CLAUDE.md
2. **State Recovery** — Read changelog.md (last 5), tasklog.md (all open), decision-log.md (recent)
3. **Pending Closure** — List open tasks, recommend close/continue/archive
4. **Health Check** — Run heartbeat (automatic via hook), review any findings
5. **Next Steps** — Propose 2-3 concrete actions ranked by impact
6. **User Confirmation** — Never start work without explicit direction

**Session End Protocol**:
1. Update tasklog.md with completed/new items
2. Update changelog.md with significant decisions
3. Update decision-log.md if debates occurred
4. Run `/sdd:graph` if artifacts changed
5. Run `/sdd:dashboard` to refresh ALM

---

## Quality Standards

### Documentation
- Agent instruction files MUST be kept current with all features
- Skills MUST include inline documentation of inputs, outputs, behavior
- Breaking changes MUST be documented with migration guidance

### Error Handling
- All errors MUST use consistent format with remediation
- Scripts MUST return appropriate exit codes (0 for hooks, always)
- Warnings MUST include actionable recommendations

### Testing
- Scripts MUST be tested on both platforms before merge
- Workflow changes MUST include end-to-end validation

### Brand
- Gold `#FFD700` for accents — Blue `#137DC5` for success — **NEVER green**
- Poppins headings · Montserrat body · JetBrains Mono code
- Neo-Swiss dark aesthetic (`#020617` body)

---

## Governance

This constitution supersedes all other development practices.

**Amendment Process**:
1. Propose change with rationale
2. Assess impact on existing skills and workflows
3. Update affected templates and documentation
4. Increment version appropriately

**Version Policy**:
- MAJOR: Principle removal or incompatible redefinition
- MINOR: New principle or significant expansion
- PATCH: Clarification or minor refinement

**Compliance**: All skill changes MUST be validated against these principles.

**Version**: 2.0.0 | **Ratified**: 2026-02-17 | **Last Amended**: 2026-03-23
