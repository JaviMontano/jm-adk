# SDD Sentinel — Heartbeat Checklist

> This file is read by the SDD Sentinel on each wake-up cycle.
> It drives the perceive-decide-act loop for autonomous project health monitoring.
> Cost-optimized: PERCEIVE and DECIDE are rule-based (zero LLM cost).
> ACT invokes LLM only when genuine anomalies require judgment.

## PERCEIVE (Rule-Based — Zero LLM Cost)

The sentinel collects raw facts by reading files. No inference, no judgment.

### P1. Project Structure
- [ ] Read `.specify/context.json` — extract active feature, pipeline state
- [ ] Read `.specify/sentinel-state.json` — extract last run, suppression state
- [ ] Verify `CONSTITUTION.md` exists at project root
- [ ] Verify `PREMISE.md` exists at project root
- [ ] List features in `specs/` — count and identify each

### P2. Artifact Freshness
- [ ] For each feature: stat `spec.md`, `plan.md`, `tasks.md`, `analysis.md`
- [ ] Record mtime (last modified) for each artifact
- [ ] Compute days-since-modified for each

### P3. Pipeline Integrity
- [ ] For each feature: determine expected artifacts based on pipeline phase
- [ ] Cross-check: if pipeline says "spec complete", does `spec.md` exist?
- [ ] Count tasks: total vs checked in `tasks.md`

### P4. Assertion Integrity
- [ ] For each feature with `tests/features/`: compute SHA256 of all .feature files
- [ ] Compare computed hash to stored hash in `.specify/context.json`
- [ ] Record: valid, tampered, or missing

### P5. Cross-Reference Integrity
- [ ] Grep `tasks.md` for FR-NNN references → verify each exists in `spec.md`
- [ ] Grep `spec.md` for SC-NNN references → verify success criteria defined
- [ ] Check for orphaned tasks (no FR/US tag)

### P6. Health Baseline
- [ ] Read `.specify/health-history.json` — get last snapshot score
- [ ] Compute current score using 4-factor model
- [ ] Calculate delta from last snapshot

## DECIDE (Rule-Based — Zero LLM Cost)

Apply fixed rules to PERCEIVE data. Produce a findings list.

### D1. Suppression Check
- If last run < 30 minutes ago AND no file mtimes changed → emit `HEARTBEAT_OK`, exit
- If `suppressedUntil` is in the future → emit `HEARTBEAT_OK`, exit

### D2. Staleness Detection
- Flag: any artifact with mtime > 7 days AND phase is `in_progress`
- Severity: WARNING for 7-14 days, CRITICAL for 14+ days

### D3. Pipeline Anomalies
- Flag: pipeline phase says "complete" but expected artifact is missing
- Flag: phase says "not_started" but artifact exists (premature creation)
- Severity: HIGH

### D4. Integrity Violations
- Flag: assertion hash tampered (computed ≠ stored)
- Severity: CRITICAL

### D5. Cross-Reference Breaks
- Flag: FR-NNN referenced in tasks but not defined in spec
- Flag: orphaned tasks exceeding 20% of total
- Severity: MEDIUM

### D6. Health Regression
- Flag: current score < last snapshot by > 10 points
- Severity: HIGH

### D7. Suppression Decision
- If zero flags: emit `HEARTBEAT_OK`, suppress next 2 cycles (90 min)
- If only WARNING flags: emit findings, suppress next 1 cycle (45 min)
- If HIGH or CRITICAL flags: emit findings, no suppression

## ACT (LLM-Assisted — Only When Findings Non-Empty)

When DECIDE produces findings, the sentinel performs these actions:

### A1. Health Snapshot
- Append current health score to `.specify/health-history.json`
- Cap at 100 entries (FIFO)

### A2. Phase Velocity Update
- Record any new phase transitions in `.specify/phase-velocity.json`

### A3. Traceability Rebuild
- Rebuild `.specify/traceability-index.json` from current artifacts

### A4. Auto-Resolution (Trivial Issues Only)
- Stale timestamp on completed phase → mark as acknowledged
- Whitespace-only changes flagged as drift → suppress

### A5. Report Generation
- Write `.specify/HEARTBEAT-REPORT.md` with:
  - Timestamp and run number
  - Findings table (severity, category, description, recommended action)
  - Health score trend (last 5 snapshots)
  - Proposed next `/sdd:` commands
  - Count of auto-resolved items

### A6. Notification Decision
- If CRITICAL findings: notify immediately
- If HIGH findings: notify with summary
- If only WARNING: batch into next report, do not interrupt

---

## Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `intervalMinutes` | 45 | Minutes between heartbeat cycles |
| `staleThresholdDays` | 7 | Days before artifact flagged stale |
| `healthRegressionThreshold` | 10 | Score drop to trigger HIGH flag |
| `maxHistoryEntries` | 100 | Health snapshots retained |
| `suppressionCycles` | 2 | Cycles to suppress after clean run |

---

*SDD Sentinel v1.0 · MetodologIA · Perceive → Decide → Act*
