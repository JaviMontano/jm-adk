#!/usr/bin/env bash
# sdd-hooks-install.sh — Install SDD git hooks for assertion integrity
#
# Usage: bash scripts/sdd-hooks-install.sh [project-path]
#
# Installs pre-commit and post-commit hooks that verify BDD assertion hashes.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_PATH="${1:-.}"

GOLD='\033[38;5;220m'
BLUE='\033[38;5;33m'
WHITE='\033[1;37m'
MUTED='\033[38;5;245m'
RED='\033[38;5;196m'
RESET='\033[0m'

HOOKS_DIR="$PROJECT_PATH/.git/hooks"

if [[ ! -d "$PROJECT_PATH/.git" ]]; then
  echo -e "${MUTED}Not a git repository — skipping hook installation${RESET}"
  exit 0
fi

mkdir -p "$HOOKS_DIR"

UPSTREAM_PRE="$ROOT_DIR/.claude/skills/iikit-core/scripts/bash/pre-commit-hook.sh"
UPSTREAM_POST="$ROOT_DIR/.claude/skills/iikit-core/scripts/bash/post-commit-hook.sh"

install_hook() {
  local hook_name="$1"
  local upstream_script="$2"
  local target="$HOOKS_DIR/$hook_name"

  if [[ ! -f "$upstream_script" ]]; then
    echo -e "  ${MUTED}$hook_name: upstream script not found, skipping${RESET}"
    return
  fi

  if [[ -f "$target" ]]; then
    # Check if it's an SDD hook
    if grep -q "SDD\|IIKit\|iikit" "$target" 2>/dev/null; then
      cp "$upstream_script" "$target"
      chmod +x "$target"
      echo -e "  ${BLUE}$hook_name${RESET}: updated (SDD hook replaced)"
    else
      echo -e "  ${GOLD}$hook_name${RESET}: existing non-SDD hook preserved"
      echo -e "    ${MUTED}To override: rm $target && re-run this script${RESET}"
    fi
  else
    cp "$upstream_script" "$target"
    chmod +x "$target"
    echo -e "  ${BLUE}$hook_name${RESET}: installed"
  fi
}

echo -e "${WHITE}Installing SDD git hooks...${RESET}"
install_hook "pre-commit" "$UPSTREAM_PRE"
install_hook "post-commit" "$UPSTREAM_POST"

echo ""
echo -e "${BLUE}Hooks installed.${RESET} Assertion integrity will be verified on each commit."
echo -e "${MUTED}Pre-commit: validates .feature file hashes against context.json${RESET}"
echo -e "${MUTED}Post-commit: stores assertion hashes as git notes${RESET}"
