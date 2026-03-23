#!/usr/bin/env bash
# sdd-feature.sh — Create or select SDD features with MetodologIA branding
#
# Usage:
#   bash scripts/sdd-feature.sh new "Feature description" [project-path]
#   bash scripts/sdd-feature.sh use <selector> [project-path]
#   bash scripts/sdd-feature.sh list [project-path]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

SUBCOMMAND="${1:-list}"
ARG="${2:-}"
PROJECT_PATH="${3:-.}"

GOLD='\033[38;5;220m'
BLUE='\033[38;5;33m'
WHITE='\033[1;37m'
MUTED='\033[38;5;245m'
RED='\033[38;5;196m'
RESET='\033[0m'
BOLD='\033[1m'

SPECS_DIR="$PROJECT_PATH/specs"
SPECIFY_DIR="$PROJECT_PATH/.specify"

UPSTREAM_CREATE="$ROOT_DIR/.claude/skills/iikit-core/scripts/bash/create-new-feature.sh"
UPSTREAM_SELECT="$ROOT_DIR/.claude/skills/iikit-core/scripts/bash/set-active-feature.sh"

case "$SUBCOMMAND" in
  new|create)
    if [[ -z "$ARG" ]]; then
      echo -e "${RED}Usage: sdd-feature.sh new \"Feature description\"${RESET}"
      exit 1
    fi
    echo -e "${GOLD}Creating feature:${RESET} $ARG"
    if [[ -x "$UPSTREAM_CREATE" ]]; then
      bash "$UPSTREAM_CREATE" --json "$ARG" 2>/dev/null || true
    else
      # Manual creation
      mkdir -p "$SPECS_DIR"
      # Find next number
      LAST=$(ls -1d "$SPECS_DIR"/[0-9][0-9][0-9]-*/ 2>/dev/null | sort -r | head -1 | xargs basename 2>/dev/null | cut -c1-3 || echo "000")
      NEXT=$(printf "%03d" $((10#$LAST + 1)))
      SLUG=$(echo "$ARG" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//' | cut -c1-40)
      FEATURE_DIR="$SPECS_DIR/$NEXT-$SLUG"
      mkdir -p "$FEATURE_DIR/checklists" "$FEATURE_DIR/tests/features"
      echo "# $ARG" > "$FEATURE_DIR/spec.md"
      echo "$NEXT-$SLUG" > "$SPECIFY_DIR/active-feature"
      echo -e "${BLUE}Created:${RESET} $FEATURE_DIR"
    fi
    echo -e "${GOLD}Next:${RESET} /sdd:spec ${MUTED}— Write the feature specification${RESET}"
    ;;

  use|select)
    if [[ -z "$ARG" ]]; then
      echo -e "${RED}Usage: sdd-feature.sh use <selector>${RESET}"
      echo -e "${MUTED}Selector: number (1), partial name (auth), or full dir (001-user-auth)${RESET}"
      exit 1
    fi
    if [[ -x "$UPSTREAM_SELECT" ]]; then
      bash "$UPSTREAM_SELECT" --json "$ARG" 2>/dev/null
    else
      # Simple selection
      MATCH=$(ls -1d "$SPECS_DIR"/[0-9][0-9][0-9]-*/ 2>/dev/null | xargs -I{} basename {} | grep -i "$ARG" | head -1 || echo "")
      if [[ -n "$MATCH" ]]; then
        mkdir -p "$SPECIFY_DIR"
        echo "$MATCH" > "$SPECIFY_DIR/active-feature"
        echo -e "${BLUE}Active feature:${RESET} $MATCH"
      else
        echo -e "${RED}No feature matching '$ARG'${RESET}"
        exit 1
      fi
    fi
    ;;

  list|ls)
    if [[ ! -d "$SPECS_DIR" ]]; then
      echo -e "${MUTED}No features yet. Run: /sdd:spec${RESET}"
      exit 0
    fi
    ACTIVE=""
    [[ -f "$SPECIFY_DIR/active-feature" ]] && ACTIVE=$(cat "$SPECIFY_DIR/active-feature" | tr -d '[:space:]')
    echo -e "${WHITE}${BOLD}Features:${RESET}"
    for d in "$SPECS_DIR"/[0-9][0-9][0-9]-*/; do
      [[ -d "$d" ]] || continue
      name=$(basename "$d")
      # Count tasks
      total=0; checked=0
      if [[ -f "$d/tasks.md" ]]; then
        total=$(grep -c '^\- \[' "$d/tasks.md" 2>/dev/null || echo 0)
        checked=$(grep -c '^\- \[x\]' "$d/tasks.md" 2>/dev/null || echo 0)
      fi
      marker=""
      [[ "$name" == "$ACTIVE" ]] && marker=" ${GOLD}← active${RESET}"
      echo -e "  ${BLUE}$name${RESET} ($checked/$total tasks)$marker"
    done
    ;;

  *)
    echo -e "${RED}Unknown subcommand: $SUBCOMMAND${RESET}"
    echo "Usage: sdd-feature.sh {new|use|list} [args] [project-path]"
    exit 1
    ;;
esac
