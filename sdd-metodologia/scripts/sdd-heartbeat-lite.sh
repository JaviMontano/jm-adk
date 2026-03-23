#!/usr/bin/env bash
# SDD Heartbeat Lite — Per-prompt ambient intelligence
# Runs via UserPromptSubmit hook. MUST complete < 100ms.
# stdout = context injection (empty if healthy). Exit 0 always.
# Bash 3.2 compatible (macOS default). Zero external deps.

set -euo pipefail

# ── Config ──
STALE_DAYS=7
CRITICAL_SCORE=40
SUPPRESS_MINUTES=30  # CLR-004: Fixed 30 min suppression (balanced)

# ── Detect project ──
SPECIFY_DIR=".specify"
[ -d "$SPECIFY_DIR" ] || exit 0  # Not an SDD project — silent

# ── Init mode ──
if [ "${1:-}" = "--init" ]; then
  STATE="$SPECIFY_DIR/sentinel-state.json"
  if [ ! -f "$STATE" ]; then
    NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    cat > "$STATE" << EOJSON
{
  "enabled": true,
  "lastRun": "$NOW",
  "runCount": 0,
  "intervalMinutes": $SUPPRESS_MINUTES,
  "suppressedUntil": null,
  "findings": [],
  "autoClosedCount": 0
}
EOJSON
    echo "SDD sentinel initialized"
  fi
  exit 0
fi

# ── Check suppression (fast path — grep, no python) ──
STATE="$SPECIFY_DIR/sentinel-state.json"
if [ -f "$STATE" ]; then
  SUPPRESSED_RAW=$(grep -o '"suppressedUntil"[[:space:]]*:[[:space:]]*"[^"]*"' "$STATE" 2>/dev/null | head -1 | sed 's/.*: *"//;s/"//')
  if [ -n "$SUPPRESSED_RAW" ] && [ "$SUPPRESSED_RAW" != "null" ]; then
    # Compare timestamps (epoch seconds)
    NOW_EPOCH=$(date +%s)
    # Parse ISO date — handle both GNU and BSD date
    if SUP_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$SUPPRESSED_RAW" +%s 2>/dev/null); then
      :
    elif SUP_EPOCH=$(date -d "$SUPPRESSED_RAW" +%s 2>/dev/null); then
      :
    else
      SUP_EPOCH=0
    fi
    [ "$NOW_EPOCH" -lt "$SUP_EPOCH" ] && exit 0  # Suppressed — silent
  fi
fi

# ── Quick scan ──
FINDINGS=0
STALE=0
MISSING=0
HEALTH=""

# Stale artifacts (files older than STALE_DAYS)
if [ -d "$SPECIFY_DIR" ]; then
  STALE=$(find "$SPECIFY_DIR" -maxdepth 2 -name "*.md" -mtime +"$STALE_DAYS" 2>/dev/null | wc -l | tr -d ' ')
  [ "$STALE" -gt 0 ] && FINDINGS=$((FINDINGS + STALE))
fi

# Missing critical files
[ ! -f "CONSTITUTION.md" ] && MISSING=$((MISSING + 1))
[ ! -f "PREMISE.md" ] && MISSING=$((MISSING + 1))
[ ! -f "$SPECIFY_DIR/context.json" ] && MISSING=$((MISSING + 1))
[ "$MISSING" -gt 0 ] && FINDINGS=$((FINDINGS + MISSING))

# Health score regression (read last score from health-history.json)
HH="$SPECIFY_DIR/health-history.json"
if [ -f "$HH" ]; then
  # Extract last score via grep — works with both array and object formats
  LAST_SCORE=$(grep -o '"score"[[:space:]]*:[[:space:]]*[0-9]*' "$HH" | tail -1 | grep -o '[0-9]*$')
  if [ -n "$LAST_SCORE" ] && [ "$LAST_SCORE" -lt "$CRITICAL_SCORE" ]; then
    HEALTH="CRITICAL:${LAST_SCORE}"
    FINDINGS=$((FINDINGS + 1))
  fi
fi

# ── Report ──
if [ "$FINDINGS" -gt 0 ]; then
  MSG=""
  [ "$STALE" -gt 0 ] && MSG="${MSG}${STALE} stale"
  [ "$MISSING" -gt 0 ] && { [ -n "$MSG" ] && MSG="${MSG}, "; MSG="${MSG}${MISSING} missing"; }
  [ -n "$HEALTH" ] && { [ -n "$MSG" ] && MSG="${MSG}, "; MSG="${MSG}health:${HEALTH}"; }
  echo "⚡ SDD: ${MSG} — /sdd:sentinel"
fi

exit 0
