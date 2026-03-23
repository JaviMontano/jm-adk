#!/usr/bin/env bash
# sdd-next-step.sh — Suggest next SDD command based on pipeline state
#
# Usage: bash scripts/sdd-next-step.sh [project-path]

set -euo pipefail

PROJECT_PATH="${1:-.}"

GOLD='\033[38;5;220m'
BLUE='\033[38;5;33m'
WHITE='\033[1;37m'
MUTED='\033[38;5;245m'
RESET='\033[0m'
BOLD='\033[1m'

SPECS_DIR="$PROJECT_PATH/specs"

# ─── Find active feature ───
ACTIVE_FEATURE=""
if [[ -f "$PROJECT_PATH/.specify/active-feature" ]]; then
  ACTIVE_FEATURE=$(cat "$PROJECT_PATH/.specify/active-feature" | tr -d '[:space:]')
fi

# If no active feature, find the latest one
if [[ -z "$ACTIVE_FEATURE" ]] && [[ -d "$SPECS_DIR" ]]; then
  ACTIVE_FEATURE=$(ls -1d "$SPECS_DIR"/[0-9][0-9][0-9]-*/ 2>/dev/null | sort -r | head -1 | xargs basename 2>/dev/null || echo "")
fi

if [[ -z "$ACTIVE_FEATURE" ]]; then
  # No features at all
  if [[ ! -f "$PROJECT_PATH/CONSTITUTION.md" ]]; then
    echo -e "${GOLD}Next:${RESET} /sdd:00-constitution ${MUTED}— Define governance principles first${RESET}"
  elif [[ ! -f "$PROJECT_PATH/PREMISE.md" ]]; then
    echo -e "${GOLD}Next:${RESET} /sdd:core init ${MUTED}— Initialize project and create PREMISE.md${RESET}"
  else
    echo -e "${GOLD}Next:${RESET} /sdd:spec ${MUTED}— Specify your first feature${RESET}"
  fi
  exit 0
fi

FP="$SPECS_DIR/$ACTIVE_FEATURE"
echo -e "${MUTED}Active feature: ${WHITE}$ACTIVE_FEATURE${RESET}"

# ─── Determine next phase ───
if [[ ! -f "$FP/spec.md" ]]; then
  echo -e "${GOLD}Next:${RESET} /sdd:spec ${MUTED}— Create feature specification${RESET}"
elif [[ ! -f "$FP/plan.md" ]]; then
  echo -e "${GOLD}Next:${RESET} /sdd:plan ${MUTED}— Create technical design ${WHITE}[GATE]${RESET}"
elif [[ ! -d "$FP/checklists" ]] || [[ -z "$(ls -A "$FP/checklists" 2>/dev/null)" ]]; then
  echo -e "${GOLD}Next:${RESET} /sdd:check ${MUTED}— Generate quality checklists (optional)${RESET}"
  echo -e "  ${MUTED}or${RESET} /sdd:test ${MUTED}— Skip to BDD test specs${RESET}"
elif [[ ! -d "$FP/tests/features" ]] || [[ -z "$(ls -A "$FP/tests/features" 2>/dev/null)" ]]; then
  echo -e "${GOLD}Next:${RESET} /sdd:test ${MUTED}— Generate BDD Gherkin test specs${RESET}"
elif [[ ! -f "$FP/tasks.md" ]]; then
  echo -e "${GOLD}Next:${RESET} /sdd:tasks ${MUTED}— Generate dependency-ordered task breakdown${RESET}"
elif [[ ! -f "$FP/analysis.md" ]]; then
  echo -e "${GOLD}Next:${RESET} /sdd:analyze ${MUTED}— Cross-artifact consistency check ${WHITE}[GATE]${RESET}"
  echo -e "  ${MUTED}or${RESET} /sdd:impl ${MUTED}— Skip to implementation${RESET}"
else
  # Check task completion
  total=$(grep -c '^\- \[' "$FP/tasks.md" 2>/dev/null || echo 0)
  checked=$(grep -c '^\- \[x\]' "$FP/tasks.md" 2>/dev/null || echo 0)
  if [[ $total -gt 0 ]] && [[ $checked -lt $total ]]; then
    echo -e "${GOLD}Next:${RESET} /sdd:impl ${MUTED}— Continue implementation ($checked/$total tasks done) ${WHITE}[GATE]${RESET}"
  elif [[ $checked -eq $total ]] && [[ $total -gt 0 ]]; then
    echo -e "${BLUE}Feature complete!${RESET} ($checked/$total tasks done)"
    echo -e "${GOLD}Next:${RESET} /sdd:issues ${MUTED}— Export to GitHub Issues (optional)${RESET}"
    echo -e "  ${MUTED}or${RESET} /sdd:dashboard ${MUTED}— Generate visual dashboard${RESET}"
    echo -e "  ${MUTED}or${RESET} /sdd:spec ${MUTED}— Start a new feature${RESET}"
  else
    echo -e "${GOLD}Next:${RESET} /sdd:impl ${MUTED}— Start implementation ${WHITE}[GATE]${RESET}"
  fi
fi
