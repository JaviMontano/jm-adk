#!/usr/bin/env bash
# verify-brand.sh — Validate MetodologIA branding on all IIC/kit template.js files
# Returns exit code 0 if all checks pass, 1 otherwise.
#
# Usage: bash scripts/verify-brand.sh
#
# © 2026 MetodologIA · GPL-3.0

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILLS_DIR="$ROOT_DIR/.claude/skills"

ERRORS=0
WARNINGS=0

pass() { echo "  ✓ $1"; }
fail() { echo "  ✗ $1"; ERRORS=$((ERRORS + 1)); }
warn() { echo "  ⚠ $1"; WARNINGS=$((WARNINGS + 1)); }

check_token() {
  local file="$1" token="$2" label="$3"
  if grep -q "$token" "$file" 2>/dev/null; then
    pass "$label: found $token"
  else
    fail "$label: missing $token"
  fi
}

check_absent() {
  local file="$1" token="$2" label="$3"
  if grep -q "$token" "$file" 2>/dev/null; then
    fail "$label: PROHIBITED token $token still present"
  else
    pass "$label: $token absent (good)"
  fi
}

echo "╔══════════════════════════════════════════════════╗"
echo "║  MetodologIA Brand Verification                 ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# ─── 1. Required MetodologIA tokens ───
echo "1. Required brand tokens"
for skill_dir in "$SKILLS_DIR"/iikit-*/; do
  template="$skill_dir/scripts/dashboard/template.js"
  skill=$(basename "$skill_dir")
  if [[ ! -f "$template" ]]; then
    warn "$skill: template.js not found"
    continue
  fi

  check_token "$template" "#122562" "$skill"
  check_token "$template" "#FFD700" "$skill"
  check_token "$template" "#137DC5" "$skill"
  check_token "$template" "#F8F9FC" "$skill"
  check_token "$template" "Poppins" "$skill"
  check_token "$template" "metodolog" "$skill"
done

# ─── 2. GREEN AUDIT (critical) ───
echo ""
echo "2. Green audit (CRITICAL — no green in success/done/verified)"
for skill_dir in "$SKILLS_DIR"/iikit-*/; do
  template="$skill_dir/scripts/dashboard/template.js"
  skill=$(basename "$skill_dir")
  [[ ! -f "$template" ]] && continue

  check_absent "$template" "#27c93f" "$skill"
  check_absent "$template" "#22c55e" "$skill"
done

# ─── 3. Prohibited legacy tokens ───
echo ""
echo "3. Prohibited legacy tokens"
for skill_dir in "$SKILLS_DIR"/iikit-*/; do
  template="$skill_dir/scripts/dashboard/template.js"
  skill=$(basename "$skill_dir")
  [[ ! -f "$template" ]] && continue

  check_absent "$template" "#0f1117" "$skill (old dark bg)"
done

# ─── 4. Phase variant SHA consistency ───
echo ""
echo "4. Phase variant SHA256 consistency"
CANONICAL_SHA=""
PHASE_SKILLS=(
  iikit-00-constitution iikit-01-specify iikit-02-plan iikit-03-checklist
  iikit-04-testify iikit-05-tasks iikit-06-analyze iikit-07-implement
  iikit-08-taskstoissues iikit-bugfix iikit-clarify
)
for skill in "${PHASE_SKILLS[@]}"; do
  template="$SKILLS_DIR/$skill/scripts/dashboard/template.js"
  [[ ! -f "$template" ]] && continue
  sha=$(shasum -a 256 "$template" | cut -c1-12)
  if [[ -z "$CANONICAL_SHA" ]]; then
    CANONICAL_SHA="$sha"
    pass "$skill: SHA=$sha (canonical)"
  elif [[ "$sha" == "$CANONICAL_SHA" ]]; then
    pass "$skill: SHA=$sha (matches)"
  else
    fail "$skill: SHA=$sha (MISMATCH — expected $CANONICAL_SHA)"
  fi
done

# ─── 5. JS module validity ───
echo ""
echo "5. JS module validity"
for variant in "iikit-core" "iikit-00-constitution"; do
  template="$SKILLS_DIR/$variant/scripts/dashboard/template.js"
  [[ ! -f "$template" ]] && continue
  if node -e "require('$template')" 2>/dev/null; then
    pass "$variant: node require() succeeds"
  else
    fail "$variant: node require() FAILED"
  fi
done

# ─── Summary ───
echo ""
echo "════════════════════════════════════════════════════"
if [[ $ERRORS -eq 0 ]]; then
  echo "  RESULT: ALL CHECKS PASSED ($WARNINGS warnings)"
  echo "════════════════════════════════════════════════════"
  exit 0
else
  echo "  RESULT: $ERRORS ERRORS, $WARNINGS warnings"
  echo "════════════════════════════════════════════════════"
  exit 1
fi
