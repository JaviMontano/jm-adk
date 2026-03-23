#!/usr/bin/env bash
# sdd-prereqs.sh — Check prerequisites for SDD pipeline phases
#
# Usage: bash scripts/sdd-prereqs.sh <phase> [project-path]
# Phases: 00, 01, 02, 03, 04, 05, 06, 07, 08, core, clarify, bugfix

set -euo pipefail

PHASE="${1:-}"
PROJECT_PATH="${2:-.}"

GOLD='\033[38;5;220m'
BLUE='\033[38;5;33m'
RED='\033[38;5;196m'
WHITE='\033[1;37m'
MUTED='\033[38;5;245m'
RESET='\033[0m'

if [[ -z "$PHASE" ]]; then
  echo "Usage: bash sdd-prereqs.sh <phase> [project-path]"
  exit 1
fi

SPECS_DIR="$PROJECT_PATH/specs"
ACTIVE=""
if [[ -f "$PROJECT_PATH/.specify/active-feature" ]]; then
  ACTIVE=$(cat "$PROJECT_PATH/.specify/active-feature" | tr -d '[:space:]')
fi
if [[ -z "$ACTIVE" ]] && [[ -d "$SPECS_DIR" ]]; then
  ACTIVE=$(ls -1d "$SPECS_DIR"/[0-9][0-9][0-9]-*/ 2>/dev/null | sort -r | head -1 | xargs basename 2>/dev/null || echo "")
fi

FP="$SPECS_DIR/$ACTIVE"
ERRORS=0

check() {
  local label="$1"
  local condition="$2"
  if eval "$condition"; then
    echo -e "  ${BLUE}✓${RESET} $label"
  else
    echo -e "  ${RED}✗${RESET} $label"
    ERRORS=$((ERRORS + 1))
  fi
}

echo -e "${WHITE}Prerequisites for phase ${GOLD}$PHASE${RESET}:"

case "$PHASE" in
  00|constitution)
    echo -e "${MUTED}  No prerequisites — constitution is the starting point.${RESET}"
    ;;
  01|specify)
    check "CONSTITUTION.md exists" "[[ -f '$PROJECT_PATH/CONSTITUTION.md' ]]"
    ;;
  02|plan)
    check "CONSTITUTION.md exists" "[[ -f '$PROJECT_PATH/CONSTITUTION.md' ]]"
    check "spec.md exists" "[[ -f '$FP/spec.md' ]]"
    ;;
  03|checklist)
    check "spec.md exists" "[[ -f '$FP/spec.md' ]]"
    check "plan.md exists" "[[ -f '$FP/plan.md' ]]"
    ;;
  04|testify)
    check "spec.md exists" "[[ -f '$FP/spec.md' ]]"
    check "plan.md exists" "[[ -f '$FP/plan.md' ]]"
    ;;
  05|tasks)
    check "spec.md exists" "[[ -f '$FP/spec.md' ]]"
    check "plan.md exists" "[[ -f '$FP/plan.md' ]]"
    ;;
  06|analyze)
    check "CONSTITUTION.md exists" "[[ -f '$PROJECT_PATH/CONSTITUTION.md' ]]"
    check "spec.md exists" "[[ -f '$FP/spec.md' ]]"
    check "plan.md exists" "[[ -f '$FP/plan.md' ]]"
    check "tasks.md exists" "[[ -f '$FP/tasks.md' ]]"
    ;;
  07|implement)
    check "CONSTITUTION.md exists" "[[ -f '$PROJECT_PATH/CONSTITUTION.md' ]]"
    check "spec.md exists" "[[ -f '$FP/spec.md' ]]"
    check "plan.md exists" "[[ -f '$FP/plan.md' ]]"
    check "tasks.md exists" "[[ -f '$FP/tasks.md' ]]"
    ;;
  08|issues)
    check "tasks.md exists" "[[ -f '$FP/tasks.md' ]]"
    ;;
  core|clarify|bugfix)
    echo -e "${MUTED}  No hard prerequisites for utility commands.${RESET}"
    ;;
  *)
    echo -e "${RED}Unknown phase: $PHASE${RESET}"
    exit 1
    ;;
esac

echo ""
if [[ $ERRORS -gt 0 ]]; then
  echo -e "${RED}$ERRORS prerequisite(s) missing.${RESET} Run earlier phases first."
  exit 1
else
  echo -e "${BLUE}All prerequisites met.${RESET} Ready for /sdd:$PHASE"
fi
