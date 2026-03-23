#!/usr/bin/env bash
# sync-upstream.sh — Fetch upstream IIC/kit changes and reapply MetodologIA brand
#
# Usage: bash scripts/sync-upstream.sh
#
# Flow:
#   1. Fetch upstream/main
#   2. Stash local changes (if any)
#   3. Merge upstream/main
#   4. Reapply MetodologIA brand overlay
#   5. Verify brand integrity
#   6. Commit merge + brand
#   7. Pop stash
#
# © 2026 MetodologIA · GPL-3.0

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

echo "╔══════════════════════════════════════════════════╗"
echo "║  IIC-MetodologIA Upstream Sync                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# ─── 1. Fetch upstream ───
echo "Step 1: Fetching upstream..."
git fetch upstream main 2>&1 || { echo "ERROR: Could not fetch upstream. Check remote config."; exit 1; }

# ─── 2. Check for local changes ───
STASHED=false
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
  echo "Step 2: Stashing local changes..."
  git stash push -m "sync-upstream: auto-stash before merge"
  STASHED=true
else
  echo "Step 2: No local changes to stash."
fi

# ─── 3. Merge upstream ───
echo "Step 3: Merging upstream/main..."
if git merge upstream/main --no-edit 2>&1; then
  echo "  Merge successful."
else
  echo ""
  echo "  MERGE CONFLICT detected."
  echo "  Attempting to resolve by accepting upstream for template.js and reapplying brand..."
  # Accept upstream version of template.js files, then reapply brand
  for f in .claude/skills/*/scripts/dashboard/template.js; do
    git checkout --theirs "$f" 2>/dev/null || true
    git add "$f" 2>/dev/null || true
  done
  # For brand-specific files, keep ours
  for f in scripts/brand-overlay.sh scripts/verify-brand.sh scripts/sync-upstream.sh CLAUDE.md .gitattributes; do
    git checkout --ours "$f" 2>/dev/null || true
    git add "$f" 2>/dev/null || true
  done
  git commit --no-edit 2>/dev/null || true
  echo "  Conflicts resolved."
fi

# ─── 4. Reapply MetodologIA brand ───
echo "Step 4: Reapplying MetodologIA brand overlay..."
bash "$SCRIPT_DIR/brand-overlay.sh"

# ─── 5. Verify brand ───
echo ""
echo "Step 5: Verifying brand integrity..."
if bash "$SCRIPT_DIR/verify-brand.sh"; then
  echo "  Brand verification passed."
else
  echo "  WARNING: Brand verification found issues. Check output above."
fi

# ─── 6. Commit ───
echo ""
echo "Step 6: Committing sync..."
git add -A
if git diff --cached --quiet 2>/dev/null; then
  echo "  No changes to commit (already up to date)."
else
  git commit -m "sync: merge upstream/main + reapply MetodologIA brand overlay"
  echo "  Committed."
fi

# ─── 7. Pop stash ───
if $STASHED; then
  echo "Step 7: Restoring stashed changes..."
  git stash pop || echo "  WARNING: Could not auto-restore stash. Run 'git stash pop' manually."
else
  echo "Step 7: No stash to restore."
fi

echo ""
echo "Sync complete."
