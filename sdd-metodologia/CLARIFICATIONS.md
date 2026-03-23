# SDD v3.0 — Clarifications Registry

> Decisions made via /sdd:clarify cycles. Each entry is immutable once recorded.

---

## CLR-005: Knowledge Graph Matching Strategy
- **Date**: 2026-03-23
- **Question**: How to match principles to requirements in the knowledge graph?
- **Decision**: Section-based matching via `## Constitutional Alignment` in spec.md
- **Rationale**: Explicit is better than heuristic. Avoids false positives from keyword overlap. Fallback: @P-NNN tags anywhere in spec.
- **Applied to**: `scripts/sdd-knowledge-graph.js` lines 176-210

## CLR-004: Heartbeat Suppression Window
- **Date**: 2026-03-23
- **Question**: How long to suppress per-prompt heartbeat after a run?
- **Decision**: Fixed 30 minutes (balanced)
- **Rationale**: Predictable, neither too noisy (15m) nor too quiet (45m). Simple to reason about.
- **Applied to**: `scripts/sdd-heartbeat-lite.sh` line 12

## CLR-003: Dashboard Output Mode
- **Date**: 2026-03-23
- **Question**: How to handle single-file vs multi-HTML dashboard?
- **Decision**: Always emit both (single-file + multi-HTML directory)
- **Rationale**: Maximum compatibility. Single-file for quick preview, multi-HTML for full Command Center.
- **Applied to**: `scripts/generate-dashboard.js` (pending implementation — flag `--dual` default)

## CLR-002: CRM Knowledge Graph Generation
- **Date**: 2026-03-23
- **Question**: Generate knowledge graph for CRM specs now?
- **Decision**: Generate + publish in Starlight
- **Finding**: CRM specs-E/ use prose format without FR-NNN/US-NNN/SC-NNN identifiers. Knowledge graph requires formal identifiers. Graph generation deferred to when specs are re-processed through `/sdd:spec` pipeline which assigns formal IDs.
- **Action**: When CRM implementation begins, run `/sdd:spec` on each feature to generate formal spec.md with FR/US/SC IDs, then `/sdd:graph` to build the knowledge graph.

## CLR-001: Registry Cleanup
- **Date**: 2026-03-23
- **Question**: Clean old iic-metodologia/aad-metodologia references?
- **Decision**: Clean everything
- **Applied**:
  - Removed `aad-metodologia@local-desktop-app-uploads` from installed_plugins.json
  - Removed `aad-metodologia` from marketplace directory
  - Updated install path to `~/skills/plugins/sdd-metodologia`
  - Final state: only `sdd-metodologia@local-desktop-app-uploads` exists
