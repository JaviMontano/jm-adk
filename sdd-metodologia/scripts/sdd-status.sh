#!/usr/bin/env bash
# sdd-status.sh — SDD pipeline status with MetodologIA branding
#
# Usage: bash scripts/sdd-status.sh [project-path] [--json]

set -euo pipefail

PROJECT_PATH="${1:-.}"
JSON_MODE=false
[[ "${2:-}" == "--json" || "${1:-}" == "--json" ]] && JSON_MODE=true
[[ "${1:-}" == "--json" ]] && PROJECT_PATH="."

GOLD='\033[38;5;220m'
BLUE='\033[38;5;33m'
WHITE='\033[1;37m'
MUTED='\033[38;5;245m'
RED='\033[38;5;196m'
GREEN='\033[38;5;33m'
AMBER='\033[38;5;208m'
RESET='\033[0m'
BOLD='\033[1m'

SPECS_DIR="$PROJECT_PATH/specs"
SPECIFY_DIR="$PROJECT_PATH/.specify"

# ─── Detect features ───
FEATURE_COUNT=0
FEATURES=""
if [[ -d "$SPECS_DIR" ]]; then
  for d in "$SPECS_DIR"/[0-9][0-9][0-9]-*/; do
    [[ -d "$d" ]] || continue
    FEATURE_COUNT=$((FEATURE_COUNT + 1))
    name=$(basename "$d")
    FEATURES="${FEATURES}${name}\n"
  done
fi

# ─── Check artifacts ───
has_constitution=$([[ -f "$PROJECT_PATH/CONSTITUTION.md" ]] && echo "yes" || echo "no")
has_premise=$([[ -f "$PROJECT_PATH/PREMISE.md" ]] && echo "yes" || echo "no")
has_context=$([[ -f "$SPECIFY_DIR/context.json" ]] && echo "yes" || echo "no")
has_dashboard=$([[ -f "$SPECIFY_DIR/dashboard.html" ]] && echo "yes" || echo "no")

# ─── Phase status per feature ───
check_phase() {
  local feature_dir="$1"
  local file="$2"
  local is_dir="${3:-false}"

  if [[ "$is_dir" == "true" ]]; then
    [[ -d "$feature_dir/$file" ]] && [[ "$(ls -A "$feature_dir/$file" 2>/dev/null)" ]] && echo "done" || echo "pending"
  else
    [[ -f "$feature_dir/$file" ]] && echo "done" || echo "pending"
  fi
}

status_icon() {
  case "$1" in
    done) echo -e "${BLUE}●${RESET}" ;;
    pending) echo -e "${MUTED}○${RESET}" ;;
    progress) echo -e "${AMBER}◐${RESET}" ;;
  esac
}

if $JSON_MODE; then
  echo "{"
  echo "  \"constitution\": \"$has_constitution\","
  echo "  \"premise\": \"$has_premise\","
  echo "  \"context\": \"$has_context\","
  echo "  \"dashboard\": \"$has_dashboard\","
  echo "  \"features\": $FEATURE_COUNT"
  echo "}"
  exit 0
fi

# ─── Visual Output ───
echo ""
echo -e "${GOLD}╔══════════════════════════════════════════════════════╗${RESET}"
echo -e "${GOLD}║${RESET}  ${WHITE}${BOLD}SDD Pipeline Status${RESET}                                ${GOLD}║${RESET}"
echo -e "${GOLD}╚══════════════════════════════════════════════════════╝${RESET}"
echo ""

echo -e "${WHITE}Project:${RESET} $(cd "$PROJECT_PATH" && pwd)"
echo ""

# Global artifacts
echo -e "${WHITE}Global Artifacts:${RESET}"
[[ "$has_constitution" == "yes" ]] && echo -e "  ${BLUE}●${RESET} CONSTITUTION.md" || echo -e "  ${MUTED}○${RESET} CONSTITUTION.md ${MUTED}(run /sdd:00-constitution)${RESET}"
[[ "$has_premise" == "yes" ]] && echo -e "  ${BLUE}●${RESET} PREMISE.md" || echo -e "  ${MUTED}○${RESET} PREMISE.md ${MUTED}(run /sdd:core init)${RESET}"
[[ "$has_context" == "yes" ]] && echo -e "  ${BLUE}●${RESET} .specify/context.json" || echo -e "  ${MUTED}○${RESET} .specify/context.json"
[[ "$has_dashboard" == "yes" ]] && echo -e "  ${BLUE}●${RESET} .specify/dashboard.html" || echo -e "  ${MUTED}○${RESET} .specify/dashboard.html"
echo ""

# Per-feature pipeline
if [[ $FEATURE_COUNT -eq 0 ]]; then
  echo -e "${MUTED}No features found in specs/. Run /sdd:spec to create one.${RESET}"
else
  echo -e "${WHITE}Features (${FEATURE_COUNT}):${RESET}"
  echo ""
  printf "  ${MUTED}%-30s %-5s %-5s %-5s %-5s %-5s %-5s %-5s${RESET}\n" "Feature" "Spec" "Plan" "Chk" "Test" "Task" "Anlz" "Impl"
  echo -e "  ${MUTED}$(printf '%.0s─' {1..72})${RESET}"

  for d in "$SPECS_DIR"/[0-9][0-9][0-9]-*/; do
    [[ -d "$d" ]] || continue
    name=$(basename "$d")
    short="${name:0:28}"

    s_spec=$(check_phase "$d" "spec.md")
    s_plan=$(check_phase "$d" "plan.md")
    s_chk=$(check_phase "$d" "checklists" true)
    s_test=$(check_phase "$d" "tests/features" true)
    s_task=$(check_phase "$d" "tasks.md")
    s_anlz=$(check_phase "$d" "analysis.md")

    # Implementation = tasks checked
    if [[ -f "$d/tasks.md" ]]; then
      total=$(grep -c '^\- \[' "$d/tasks.md" 2>/dev/null || echo 0)
      checked=$(grep -c '^\- \[x\]' "$d/tasks.md" 2>/dev/null || echo 0)
      if [[ $total -gt 0 ]] && [[ $checked -eq $total ]]; then
        s_impl="done"
      elif [[ $checked -gt 0 ]]; then
        s_impl="progress"
      else
        s_impl="pending"
      fi
    else
      s_impl="pending"
    fi

    printf "  %-30s " "$short"
    printf "%b     " "$(status_icon $s_spec)"
    printf "%b     " "$(status_icon $s_plan)"
    printf "%b     " "$(status_icon $s_chk)"
    printf "%b     " "$(status_icon $s_test)"
    printf "%b     " "$(status_icon $s_task)"
    printf "%b     " "$(status_icon $s_anlz)"
    printf "%b" "$(status_icon $s_impl)"
    echo ""
  done
fi

echo ""
echo -e "${MUTED}Legend: ${BLUE}●${MUTED} done  ${AMBER}◐${MUTED} in progress  ${MUTED}○ pending${RESET}"
echo -e "${MUTED}SDD v1.1 · MetodologIA · $(date +%Y-%m-%d)${RESET}"
