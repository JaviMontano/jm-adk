#!/usr/bin/env bash
# sdd-sentinel.sh — SDD Sentinel: Heartbeat Orchestrator
#
# PERCEIVE + DECIDE loop (pure shell, zero LLM cost).
# Produces a JSON findings report or visual branded output.
#
# Usage: bash scripts/sdd-sentinel.sh <project-path> [--json] [--perceive-only]
#
# SDD v2.0 · MetodologIA · Perceive -> Decide -> Act

set -euo pipefail

# ─── Arguments ───
PROJECT_PATH="${1:-.}"
JSON_MODE=false
PERCEIVE_ONLY=false

for arg in "$@"; do
  case "$arg" in
    --json) JSON_MODE=true ;;
    --perceive-only) PERCEIVE_ONLY=true ;;
  esac
done
[[ "${1:-}" == "--json" || "${1:-}" == "--perceive-only" ]] && PROJECT_PATH="."

# ─── Brand Colors (MetodologIA Neo-Swiss) ───
GOLD='\033[38;5;220m'
BLUE='\033[38;5;33m'
WHITE='\033[1;37m'
MUTED='\033[38;5;245m'
RED='\033[38;5;196m'
AMBER='\033[38;5;208m'
RESET='\033[0m'
BOLD='\033[1m'

# ─── Paths ───
SPECS_DIR="$PROJECT_PATH/specs"
SPECIFY_DIR="$PROJECT_PATH/.specify"
CONTEXT_FILE="$SPECIFY_DIR/context.json"
SENTINEL_STATE="$SPECIFY_DIR/sentinel-state.json"
HEALTH_HISTORY="$SPECIFY_DIR/health-history.json"

# ─── Configuration Defaults ───
INTERVAL_MINUTES=45
STALE_THRESHOLD_DAYS=7
HEALTH_REGRESSION_THRESHOLD=10
SUPPRESSION_CYCLES=2

# ─── Accumulators ───
FINDINGS_JSON="[]"
FEATURE_SUMMARY_JSON="[]"
TOTAL_HEALTH=0
FEATURE_COUNT=0

NOW_EPOCH=$(date +%s)
NOW_ISO=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# ─── Helpers ───

py_json() {
  python3 -c "$1" 2>/dev/null
}

days_since_modified() {
  local file="$1"
  if [[ -f "$file" ]]; then
    local mtime
    if [[ "$(uname)" == "Darwin" ]]; then
      mtime=$(stat -f %m "$file")
    else
      mtime=$(stat -c %Y "$file")
    fi
    echo $(( (NOW_EPOCH - mtime) / 86400 ))
  else
    echo -1
  fi
}

add_finding() {
  local severity="$1" category="$2" message="$3" recommendation="$4"
  FINDINGS_JSON=$(py_json "
import json
findings = json.loads('''$FINDINGS_JSON''')
findings.append({
  'severity': '$severity',
  'category': '$category',
  'message': '''$message''',
  'recommendation': '$recommendation'
})
print(json.dumps(findings))
")
}

add_feature_summary() {
  local fid="$1" tasks="$2" score="$3" stale="$4" integrity="$5"
  FEATURE_SUMMARY_JSON=$(py_json "
import json
summary = json.loads('''$FEATURE_SUMMARY_JSON''')
summary.append({
  'id': '$fid',
  'tasks': '$tasks',
  'score': $score,
  'stale': $stale,
  'integrity': '$integrity'
})
print(json.dumps(summary))
")
}

# ═══════════════════════════════════════════════════════════
# PERCEIVE FUNCTIONS (read-only file stats)
# ═══════════════════════════════════════════════════════════

# P1: perceive_artifacts — Stat key files per feature, flag staleness
perceive_artifacts() {
  local project="$1"
  local specs="$project/specs"
  [[ -d "$specs" ]] || return 0

  for d in "$specs"/[0-9][0-9][0-9]-*/; do
    [[ -d "$d" ]] || continue
    local name
    name=$(basename "$d")

    for artifact in spec.md plan.md tasks.md analysis.md; do
      local filepath="$d/$artifact"
      local age
      age=$(days_since_modified "$filepath")
      if [[ $age -ge $STALE_THRESHOLD_DAYS ]] && [[ $age -ne -1 ]]; then
        local sev="WARNING"
        [[ $age -ge 14 ]] && sev="CRITICAL"
        add_finding "$sev" "staleness" \
          "$artifact in $name is $age days old (threshold: ${STALE_THRESHOLD_DAYS}d)" \
          "/sdd:status"
      fi
    done
  done
}

# P2: perceive_integrity — SHA256 of .feature files vs stored hash
perceive_integrity() {
  local project="$1"
  local specs="$project/specs"
  [[ -d "$specs" ]] || return 0

  for d in "$specs"/[0-9][0-9][0-9]-*/; do
    [[ -d "$d" ]] || continue
    local name
    name=$(basename "$d")
    local test_dir="$d/tests/features"

    if [[ -d "$test_dir" ]] && ls "$test_dir"/*.feature >/dev/null 2>&1; then
      local computed_hash
      computed_hash=$(find "$test_dir" -name "*.feature" -print0 | sort -z | xargs -0 cat | shasum -a 256 | awk '{print $1}')

      local stored_hash=""
      if [[ -f "$CONTEXT_FILE" ]]; then
        stored_hash=$(py_json "
import json
ctx = json.load(open('$CONTEXT_FILE'))
ah = ctx.get('assertionHash', ctx.get('assertion_hash', ''))
print(ah)
" || echo "")
      fi

      if [[ -z "$stored_hash" ]]; then
        _set_list_val INTEGRITY_LIST "$name" "missing"
      elif [[ "$computed_hash" == "$stored_hash" ]]; then
        _set_list_val INTEGRITY_LIST "$name" "valid"
      else
        _set_list_val INTEGRITY_LIST "$name" "tampered"
        add_finding "CRITICAL" "integrity" \
          "Assertion hash tampered for $name (expected: ${stored_hash:0:12}..., got: ${computed_hash:0:12}...)" \
          "/sdd:test"
      fi
    else
      _set_list_val INTEGRITY_LIST "$name" "no_tests"
    fi
  done
}

# P3: perceive_pipeline — Detect phase anomalies from file existence
perceive_pipeline() {
  local project="$1"
  local specs="$project/specs"
  [[ -d "$specs" ]] || return 0

  local phase_map
  if [[ -f "$CONTEXT_FILE" ]]; then
    phase_map=$(py_json "
import json
ctx = json.load(open('$CONTEXT_FILE'))
features = ctx.get('features', ctx.get('featureStates', {}))
if isinstance(features, dict):
    for fid, state in features.items():
        phases = state if isinstance(state, dict) else {}
        for phase, status in phases.items():
            print(f'{fid}|{phase}|{status}')
" 2>/dev/null || echo "")
  else
    phase_map=""
  fi

  for d in "$specs"/[0-9][0-9][0-9]-*/; do
    [[ -d "$d" ]] || continue
    local name
    name=$(basename "$d")

    # Check: phase says complete but file missing
    if [[ -n "$phase_map" ]]; then
      while IFS='|' read -r fid phase status; do
        [[ "$fid" == "$name" ]] || continue
        local expected_file=""
        case "$phase" in
          spec|specify) expected_file="$d/spec.md" ;;
          plan) expected_file="$d/plan.md" ;;
          tasks) expected_file="$d/tasks.md" ;;
          analyze|analysis) expected_file="$d/analysis.md" ;;
        esac
        if [[ -n "$expected_file" ]] && [[ "$status" == "complete" ]] && [[ ! -f "$expected_file" ]]; then
          add_finding "HIGH" "pipeline" \
            "Phase '$phase' marked complete for $name but $(basename "$expected_file") is missing" \
            "/sdd:verify"
        fi
      done <<< "$phase_map"
    fi
  done
}

# P4: perceive_references — Cross-reference FR-NNN between tasks and spec
perceive_references() {
  local project="$1"
  local specs="$project/specs"
  [[ -d "$specs" ]] || return 0

  for d in "$specs"/[0-9][0-9][0-9]-*/; do
    [[ -d "$d" ]] || continue
    local name
    name=$(basename "$d")
    local tasks_file="$d/tasks.md"
    local spec_file="$d/spec.md"

    [[ -f "$tasks_file" ]] || continue
    [[ -f "$spec_file" ]] || continue

    # Extract FR-NNN references from tasks
    local task_refs
    task_refs=$(grep -oE 'FR-[0-9]+' "$tasks_file" 2>/dev/null | sort -u || echo "")
    # Extract FR-NNN definitions from spec
    local spec_defs
    spec_defs=$(grep -oE 'FR-[0-9]+' "$spec_file" 2>/dev/null | sort -u || echo "")

    # Find orphans: in tasks but not in spec
    local orphan_count=0
    local total_refs=0
    if [[ -n "$task_refs" ]]; then
      while IFS= read -r ref; do
        total_refs=$((total_refs + 1))
        if ! echo "$spec_defs" | grep -qx "$ref"; then
          orphan_count=$((orphan_count + 1))
        fi
      done <<< "$task_refs"
    fi

    if [[ $orphan_count -gt 0 ]] && [[ $total_refs -gt 0 ]]; then
      local orphan_pct=$(( (orphan_count * 100) / total_refs ))
      if [[ $orphan_pct -ge 20 ]]; then
        add_finding "MEDIUM" "cross-reference" \
          "$orphan_count/$total_refs FR references in tasks.md of $name are orphaned (${orphan_pct}%)" \
          "/sdd:analyze"
      fi
    fi
  done
}

# P5: perceive_tasks — Count total vs checked tasks per feature
perceive_tasks() {
  local project="$1"
  local specs="$project/specs"
  [[ -d "$specs" ]] || return 0

  for d in "$specs"/[0-9][0-9][0-9]-*/; do
    [[ -d "$d" ]] || continue
    local name
    name=$(basename "$d")
    local tasks_file="$d/tasks.md"

    if [[ -f "$tasks_file" ]]; then
      _set_list_val TASK_TOTAL_LIST "$name" "$(grep -c '^\- \[' "$tasks_file" 2>/dev/null || echo 0)"
      _set_list_val TASK_CHECKED_LIST "$name" "$(grep -c '^\- \[x\]' "$tasks_file" 2>/dev/null || echo 0)"
    else
      _set_list_val TASK_TOTAL_LIST "$name" "0"
      _set_list_val TASK_CHECKED_LIST "$name" "0"
    fi
  done
}

# ═══════════════════════════════════════════════════════════
# DECIDE FUNCTIONS (rule-based, no LLM)
# ═══════════════════════════════════════════════════════════

# D1: should_suppress — Check sentinel-state.json for suppression
should_suppress() {
  local state_file="$1"
  [[ -f "$state_file" ]] || return 1

  local result
  result=$(py_json "
import json, sys
from datetime import datetime, timezone

state = json.load(open('$state_file'))
now = datetime.now(timezone.utc)

# Check suppression window
suppressed = state.get('suppressedUntil')
if suppressed:
    try:
        sup_dt = datetime.fromisoformat(suppressed.replace('Z', '+00:00'))
        if sup_dt > now:
            print('suppressed')
            sys.exit(0)
    except: pass

# Check last run recency (30 min threshold)
last_run = state.get('lastRun')
if last_run:
    try:
        lr_dt = datetime.fromisoformat(last_run.replace('Z', '+00:00'))
        delta = (now - lr_dt).total_seconds()
        if delta < 1800:
            print('recent')
            sys.exit(0)
    except: pass

print('run')
" 2>/dev/null || echo "run")

  [[ "$result" == "suppressed" || "$result" == "recent" ]]
}

# D2: decide_flags — Already applied inline during PERCEIVE via add_finding

# D3: compute_health_score — 4-factor model per feature
compute_health_score() {
  local feature_path="$1"
  local score=0

  # Factor 1: specCoverage (25 pts)
  [[ -f "$feature_path/spec.md" ]] && score=$((score + 25))

  # Factor 2: testCoverage (25 pts)
  if [[ -d "$feature_path/tests/features" ]] && ls "$feature_path/tests/features"/*.feature >/dev/null 2>&1; then
    score=$((score + 25))
  fi

  # Factor 3: taskCompletion (25 pts, proportional)
  local name
  name=$(basename "$feature_path")
  local total="$(_get_list_val "$TASK_TOTAL_LIST" "$name")"
  local checked="$(_get_list_val "$TASK_CHECKED_LIST" "$name")"
  [[ -z "$checked" ]] && checked=0
  [[ -z "$total" ]] && total=0
  if [[ $total -gt 0 ]]; then
    score=$((score + (checked * 25 / total)))
  fi

  # Factor 4: constitutionAlignment (25 pts)
  [[ -f "$PROJECT_PATH/CONSTITUTION.md" ]] && score=$((score + 25))

  echo "$score"
}

# D4: Check health regression
check_health_regression() {
  local current_score="$1"
  [[ -f "$HEALTH_HISTORY" ]] || return 0

  local last_score
  last_score=$(py_json "
import json
data = json.load(open('$HEALTH_HISTORY'))
snapshots = data.get('snapshots', data if isinstance(data, list) else [])
if snapshots:
    print(snapshots[-1].get('score', 0))
else:
    print(0)
" 2>/dev/null || echo "0")

  if [[ $last_score -gt 0 ]]; then
    local delta=$((last_score - current_score))
    if [[ $delta -ge $HEALTH_REGRESSION_THRESHOLD ]]; then
      add_finding "HIGH" "health" \
        "Health score regressed by $delta points (from $last_score to $current_score)" \
        "/sdd:analyze"
    fi
  fi
}

# D5: emit_heartbeat_ok — Update sentinel-state with clean run
emit_heartbeat_ok() {
  local suppression_minutes=$((INTERVAL_MINUTES * SUPPRESSION_CYCLES))
  local suppress_until
  suppress_until=$(py_json "
from datetime import datetime, timezone, timedelta
dt = datetime.now(timezone.utc) + timedelta(minutes=$suppression_minutes)
print(dt.strftime('%Y-%m-%dT%H:%M:%SZ'))
")

  local run_count=0
  if [[ -f "$SENTINEL_STATE" ]]; then
    run_count=$(py_json "
import json
print(json.load(open('$SENTINEL_STATE')).get('runCount', 0))
" 2>/dev/null || echo 0)
  fi
  run_count=$((run_count + 1))

  mkdir -p "$SPECIFY_DIR"
  py_json "
import json
state = {
  'enabled': True,
  'lastRun': '$NOW_ISO',
  'runCount': $run_count,
  'intervalMinutes': $INTERVAL_MINUTES,
  'lastReport': '.specify/HEARTBEAT-REPORT.md',
  'suppressedUntil': '$suppress_until',
  'findings': [],
  'autoClosedCount': 0
}
with open('$SENTINEL_STATE', 'w') as f:
    json.dump(state, f, indent=2)
    f.write('\n')
"
  echo "$run_count"
}

# D6: emit_findings_state — Update sentinel-state with findings
emit_findings_state() {
  local findings_json="$1"
  local has_critical
  has_critical=$(py_json "
import json
findings = json.loads('''$findings_json''')
sevs = [f['severity'] for f in findings]
if 'CRITICAL' in sevs or 'HIGH' in sevs:
    print('high')
else:
    print('low')
")

  local suppress_until="null"
  if [[ "$has_critical" == "low" ]]; then
    # WARNING-only: suppress 1 cycle
    suppress_until=$(py_json "
from datetime import datetime, timezone, timedelta
dt = datetime.now(timezone.utc) + timedelta(minutes=$INTERVAL_MINUTES)
print('\"' + dt.strftime('%Y-%m-%dT%H:%M:%SZ') + '\"')
")
  fi

  local run_count=0
  if [[ -f "$SENTINEL_STATE" ]]; then
    run_count=$(py_json "
import json
print(json.load(open('$SENTINEL_STATE')).get('runCount', 0))
" 2>/dev/null || echo 0)
  fi
  run_count=$((run_count + 1))

  mkdir -p "$SPECIFY_DIR"
  py_json "
import json
state = {
  'enabled': True,
  'lastRun': '$NOW_ISO',
  'runCount': $run_count,
  'intervalMinutes': $INTERVAL_MINUTES,
  'lastReport': '.specify/HEARTBEAT-REPORT.md',
  'suppressedUntil': $suppress_until,
  'findings': json.loads('''$findings_json'''),
  'autoClosedCount': 0
}
with open('$SENTINEL_STATE', 'w') as f:
    json.dump(state, f, indent=2)
    f.write('\n')
"
  echo "$run_count"
}

# ═══════════════════════════════════════════════════════════
# OUTPUT FUNCTIONS
# ═══════════════════════════════════════════════════════════

# JSON output
output_findings_json() {
  local run_count="$1"
  local health="$2"
  local status="findings"
  local finding_count
  finding_count=$(py_json "import json; print(len(json.loads('''$FINDINGS_JSON''')))")
  [[ "$finding_count" == "0" ]] && status="healthy"

  py_json "
import json

output = {
  'status': '$status',
  'timestamp': '$NOW_ISO',
  'runCount': $run_count,
  'healthScore': $health,
  'findings': json.loads('''$FINDINGS_JSON'''),
  'featureSummary': json.loads('''$FEATURE_SUMMARY_JSON''')
}
print(json.dumps(output, indent=2))
"
}

# Visual branded output
output_visual() {
  local run_count="$1"
  local health="$2"

  echo ""
  echo -e "${GOLD}╔══════════════════════════════════════════════════════╗${RESET}"
  echo -e "${GOLD}║${RESET}  ${WHITE}${BOLD}SDD Sentinel — Heartbeat Report${RESET}                    ${GOLD}║${RESET}"
  echo -e "${GOLD}╚══════════════════════════════════════════════════════╝${RESET}"
  echo ""

  echo -e "${WHITE}Project:${RESET} $(cd "$PROJECT_PATH" && pwd)"
  echo -e "${WHITE}Run #${run_count}${RESET} · ${MUTED}$NOW_ISO${RESET}"
  echo ""

  # Health score with color
  local health_color="$BLUE"
  [[ $health -lt 70 ]] && health_color="$AMBER"
  [[ $health -lt 40 ]] && health_color="$RED"
  echo -e "${WHITE}Health Score:${RESET} ${health_color}${BOLD}${health}/100${RESET}"
  echo ""

  # Feature summary table
  local summary_count
  summary_count=$(py_json "import json; print(len(json.loads('''$FEATURE_SUMMARY_JSON''')))")
  if [[ "$summary_count" -gt 0 ]]; then
    echo -e "${WHITE}Feature Summary:${RESET}"
    printf "  ${MUTED}%-28s %-10s %-8s %-8s %-10s${RESET}\n" "Feature" "Tasks" "Score" "Stale" "Integrity"
    echo -e "  ${MUTED}$(printf '%.0s─' {1..66})${RESET}"

    py_json "
import json
for f in json.loads('''$FEATURE_SUMMARY_JSON'''):
    fid = f['id'][:26]
    tasks = f['tasks']
    score = f['score']
    stale = 'yes' if f['stale'] else 'no'
    integrity = f['integrity']
    print(f'{fid}|{tasks}|{score}|{stale}|{integrity}')
" | while IFS='|' read -r fid tasks score stale integrity; do
      local score_color="$BLUE"
      [[ $score -lt 70 ]] && score_color="$AMBER"
      [[ $score -lt 40 ]] && score_color="$RED"
      local stale_color="$MUTED"
      [[ "$stale" == "yes" ]] && stale_color="$AMBER"
      local int_color="$BLUE"
      [[ "$integrity" == "tampered" ]] && int_color="$RED"
      [[ "$integrity" == "missing" || "$integrity" == "no_tests" ]] && int_color="$MUTED"
      printf "  %-28s %-10s " "$fid" "$tasks"
      echo -ne "${score_color}${score}${RESET}"
      printf "       "
      echo -ne "${stale_color}${stale}${RESET}"
      printf "      "
      echo -e "${int_color}${integrity}${RESET}"
    done
    echo ""
  fi

  # Findings table
  local finding_count
  finding_count=$(py_json "import json; print(len(json.loads('''$FINDINGS_JSON''')))")
  if [[ "$finding_count" -gt 0 ]]; then
    echo -e "${WHITE}Findings (${finding_count}):${RESET}"
    echo ""
    py_json "
import json
for f in json.loads('''$FINDINGS_JSON'''):
    sev = f['severity']
    cat = f['category']
    msg = f['message']
    rec = f['recommendation']
    print(f'{sev}|{cat}|{msg}|{rec}')
" | while IFS='|' read -r sev cat msg rec; do
      local sev_color="$MUTED"
      case "$sev" in
        CRITICAL) sev_color="$RED" ;;
        HIGH)     sev_color="$RED" ;;
        WARNING)  sev_color="$GOLD" ;;
        MEDIUM)   sev_color="$AMBER" ;;
      esac
      echo -e "  ${sev_color}${BOLD}[$sev]${RESET} ${WHITE}$cat${RESET}: $msg"
      echo -e "         ${MUTED}-> $rec${RESET}"
    done
    echo ""
  else
    echo -e "  ${BLUE}●${RESET} No findings — project is healthy"
    echo ""
  fi

  # Next action recommendations
  echo -e "${WHITE}Recommended Actions:${RESET}"
  if [[ "$finding_count" -gt 0 ]]; then
    py_json "
import json
recs = set()
for f in json.loads('''$FINDINGS_JSON'''):
    recs.add(f['recommendation'])
for r in sorted(recs):
    print(r)
" | while IFS= read -r rec; do
      echo -e "  ${GOLD}->  ${WHITE}$rec${RESET}"
    done
  else
    echo -e "  ${BLUE}->  ${WHITE}Continue current workflow${RESET}"
  fi

  echo ""
  echo -e "${GOLD}─────────────────────────────────────────────${RESET}"
  echo -e "${MUTED}SDD Sentinel v1.0 · MetodologIA · $(date +%Y-%m-%d)${RESET}"
}

# ═══════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════

# Validate project path
if [[ ! -d "$PROJECT_PATH" ]]; then
  echo "Error: Project path '$PROJECT_PATH' does not exist." >&2
  exit 1
fi

# Check suppression (skip if --perceive-only)
if ! $PERCEIVE_ONLY && should_suppress "$SENTINEL_STATE" 2>/dev/null; then
  if $JSON_MODE; then
    echo '{"status":"suppressed","timestamp":"'"$NOW_ISO"'","message":"Heartbeat suppressed (recent clean run or active suppression window)"}'
  else
    echo -e "${MUTED}Heartbeat suppressed — next run after suppression window expires.${RESET}"
  fi
  exit 0
fi

# Initialize tracking variables (bash 3.2 compatible — no associative arrays)
INTEGRITY_LIST=""    # "feature:status" pairs
TASK_TOTAL_LIST=""   # "feature:count" pairs
TASK_CHECKED_LIST="" # "feature:count" pairs

# Helper: get value from colon-separated list
_get_list_val() {
  local list="$1" key="$2"
  echo "$list" | tr ' ' '\n' | grep "^${key}:" | head -1 | cut -d: -f2
}
_set_list_val() {
  local varname="$1" key="$2" val="$3"
  eval "${varname}=\"\${${varname}} ${key}:${val}\""
}

# ─── PERCEIVE Phase ───
perceive_artifacts "$PROJECT_PATH"
perceive_integrity "$PROJECT_PATH"
perceive_pipeline "$PROJECT_PATH"
perceive_references "$PROJECT_PATH"
perceive_tasks "$PROJECT_PATH"

# Build feature summaries + aggregate health
if [[ -d "$SPECS_DIR" ]]; then
  for d in "$SPECS_DIR"/[0-9][0-9][0-9]-*/; do
    [[ -d "$d" ]] || continue
    local_name=$(basename "$d")
    FEATURE_COUNT=$((FEATURE_COUNT + 1))

    local_score=$(compute_health_score "$d")
    TOTAL_HEALTH=$((TOTAL_HEALTH + local_score))

    local_total="$(_get_list_val "$TASK_TOTAL_LIST" "$local_name")"
    local_checked="$(_get_list_val "$TASK_CHECKED_LIST" "$local_name")"
    local_tasks="${local_checked}/${local_total}"

    # Determine staleness for summary
    local_stale=false
    for artifact in spec.md plan.md tasks.md analysis.md; do
      age=$(days_since_modified "$d/$artifact")
      if [[ $age -ge $STALE_THRESHOLD_DAYS ]] && [[ $age -ne -1 ]]; then
        local_stale=true
        break
      fi
    done

    local_integrity="$(_get_list_val "$INTEGRITY_LIST" "$local_name")"

    add_feature_summary "$local_name" "$local_tasks" "$local_score" "$local_stale" "$local_integrity"
  done
fi

# Compute average health
AVG_HEALTH=0
if [[ $FEATURE_COUNT -gt 0 ]]; then
  AVG_HEALTH=$((TOTAL_HEALTH / FEATURE_COUNT))
fi

# Stop here if --perceive-only
if $PERCEIVE_ONLY; then
  if $JSON_MODE; then
    output_findings_json 0 "$AVG_HEALTH"
  else
    output_visual 0 "$AVG_HEALTH"
  fi
  exit 0
fi

# ─── DECIDE Phase ───
check_health_regression "$AVG_HEALTH"

# Determine if we have findings
FINDING_COUNT=$(py_json "import json; print(len(json.loads('''$FINDINGS_JSON''')))")

if [[ "$FINDING_COUNT" -eq 0 ]]; then
  # Clean run — emit ok + suppress
  RUN_COUNT=$(emit_heartbeat_ok)
else
  # Findings present — emit state with conditional suppression
  RUN_COUNT=$(emit_findings_state "$FINDINGS_JSON")
fi

# ─── OUTPUT ───
if $JSON_MODE; then
  output_findings_json "$RUN_COUNT" "$AVG_HEALTH"
else
  output_visual "$RUN_COUNT" "$AVG_HEALTH"
fi
