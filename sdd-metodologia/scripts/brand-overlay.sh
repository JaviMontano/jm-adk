#!/usr/bin/env bash
# brand-overlay.sh — Apply MetodologIA Neo-Swiss branding to IIC/kit template.js files
# Uses sed for CSS token replacements + Node.js for HTML structural changes.
# Safe to re-run: idempotent.
#
# Usage: bash scripts/brand-overlay.sh [--dry-run]
#
# © 2026 MetodologIA · GPL-3.0

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILLS_DIR="$ROOT_DIR/.claude/skills"

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

apply_css_tokens() {
  local file="$1"
  local label="$2"

  if [[ ! -f "$file" ]]; then
    echo "  SKIP: $label (file not found)"
    return
  fi

  if $DRY_RUN; then
    echo "  DRY-RUN: would brand $label"
    return
  fi

  echo "  CSS tokens: $label"

  # ─── :root — dark theme becomes MetodologIA light default ───
  sed -i '' 's/--color-bg: #0f1117/--color-bg: #F8F9FC/g' "$file"
  sed -i '' 's/--color-surface: #1a1d27/--color-surface: #FFFFFF/g' "$file"
  sed -i '' 's/--color-surface-elevated: #222536/--color-surface-elevated: #F0F1F4/g' "$file"
  sed -i '' 's/--color-surface-hover: #2a2d40/--color-surface-hover: #E8EAF0/g' "$file"
  sed -i '' 's/--color-border: #2e3148/--color-border: #E8EAF0/g' "$file"
  sed -i '' 's/--color-border-subtle: #252839/--color-border-subtle: #F0F1F4/g' "$file"
  sed -i '' 's/--color-text: #e8eaed/--color-text: #1F2833/g' "$file"
  sed -i '' 's/--color-text-secondary: #9aa0b4/--color-text-secondary: #5A5F72/g' "$file"
  sed -i '' 's/--color-text-muted: #6b7189/--color-text-muted: #808080/g' "$file"
  sed -i '' 's/--color-accent: #3B82F6/--color-accent: #137DC5/g' "$file"
  sed -i '' 's/--color-accent-hover: #60A5FA/--color-accent-hover: #1A90D8/g' "$file"
  sed -i '' 's/--color-todo: #4a90d9/--color-todo: #137DC5/g' "$file"
  sed -i '' 's/--color-inprogress: #f5a623/--color-inprogress: #D97706/g' "$file"
  sed -i '' 's/--color-done: #27c93f/--color-done: #137DC5/g' "$file"
  sed -i '' 's/--color-verified: #27c93f/--color-verified: #137DC5/g' "$file"
  sed -i '' 's/--color-p1: #ff4757/--color-p1: #DC2626/g' "$file"
  sed -i '' 's/--color-p2: #ffa502/--color-p2: #D97706/g' "$file"
  sed -i '' 's/--color-p3: #3498db/--color-p3: #137DC5/g' "$file"
  sed -i '' 's/--color-tampered: #ff4757/--color-tampered: #DC2626/g' "$file"
  sed -i '' 's/--color-missing: #6b7189/--color-missing: #808080/g' "$file"

  # Border radius (Swiss 8px grid)
  sed -i '' 's/--radius-sm: 6px/--radius-sm: 8px/g' "$file"
  sed -i '' 's/--radius-md: 10px/--radius-md: 12px/g' "$file"
  sed -i '' 's/--radius-lg: 14px/--radius-lg: 16px/g' "$file"

  # Shadows (navy-tinted)
  sed -i '' 's/--shadow-card: 0 2px 8px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)/--shadow-card: 0 2px 8px rgba(18,37,98,0.05), 0 8px 24px rgba(18,37,98,0.06)/g' "$file"
  sed -i '' 's/--shadow-card-hover: 0 8px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)/--shadow-card-hover: 0 4px 16px rgba(18,37,98,0.08)/g' "$file"
  sed -i '' 's/--shadow-column: 0 1px 4px rgba(0,0,0,0.2)/--shadow-column: 0 1px 3px rgba(18,37,98,0.06)/g' "$file"

  # Typography
  sed -i '' "s/--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Roboto, Oxygen, sans-serif/--font-sans: 'Poppins', 'Segoe UI', 'Trebuchet MS', sans-serif/g" "$file"

  # ─── [data-theme="light"] → MetodologIA dark theme ───
  sed -i '' 's/\[data-theme=\\"light\\"\]/[data-theme=\\"dark\\"]/g' "$file"
  sed -i '' 's/--color-bg: #f5f6f8/--color-bg: #122562/g' "$file"
  sed -i '' 's/--color-surface: #ffffff/--color-surface: #1A2D6B/g' "$file"
  sed -i '' 's/--color-surface-elevated: #f0f1f4/--color-surface-elevated: #0E1C4D/g' "$file"
  sed -i '' 's/--color-surface-hover: #e8e9ee/--color-surface-hover: #233578/g' "$file"
  sed -i '' 's/--color-border: #d8dae0/--color-border: #2A3F85/g' "$file"
  sed -i '' 's/--color-border-subtle: #e4e6eb/--color-border-subtle: #1E3070/g' "$file"
  sed -i '' 's/--color-text: #1a1d27/--color-text: #F8F9FC/g' "$file"
  sed -i '' 's/--color-text-secondary: #5a5f72/--color-text-secondary: #BBA0CC/g' "$file"
  sed -i '' 's/--color-text-muted: #8b90a0/--color-text-muted: #9aa0b4/g' "$file"
  sed -i '' 's/--color-accent: #2563EB/--color-accent: #FFD700/g' "$file"
  sed -i '' 's/--color-accent-hover: #3B82F6/--color-accent-hover: #E0A800/g' "$file"

  # Dark theme shadows
  sed -i '' 's/--shadow-card: 0 1px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)/--shadow-card: 0 2px 8px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)/g' "$file"
  sed -i '' 's/--shadow-card-hover: 0 4px 12px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)/--shadow-card-hover: 0 8px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)/g' "$file"
  sed -i '' 's/--shadow-column: 0 1px 3px rgba(0,0,0,0.06)/--shadow-column: 0 1px 4px rgba(0,0,0,0.2)/g' "$file"

  # ─── Catch remaining green + legacy colors ───
  sed -i '' 's/#27c93f/#137DC5/g' "$file"
  sed -i '' 's/#22c55e/#137DC5/g' "$file"
  sed -i '' 's/#1D4ED8/#122562/g' "$file"
  sed -i '' 's/#6366f1/#137DC5/g' "$file"
  sed -i '' 's/#8B5CF6/#BBA0CC/g' "$file"
}

apply_html_patch() {
  local file="$1"
  local label="$2"

  if $DRY_RUN; then
    echo "  DRY-RUN: would patch HTML $label"
    return
  fi

  echo "  HTML patch: $label"
  node "$SCRIPT_DIR/brand-html-patch.js" "$file"
}

echo "╔══════════════════════════════════════════════════╗"
echo "║  MetodologIA Brand Overlay — IIC/kit            ║"
echo "║  Neo-Swiss Design System v6                     ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# ─── Phase 1: Core variant ───
echo "Phase 1: Core variant"
apply_css_tokens "$SKILLS_DIR/iikit-core/scripts/dashboard/template.js" "iikit-core"
apply_html_patch "$SKILLS_DIR/iikit-core/scripts/dashboard/template.js" "iikit-core"

# ─── Phase 2: Phase variant (canonical) ───
echo ""
echo "Phase 2: Phase variant (canonical)"
apply_css_tokens "$SKILLS_DIR/iikit-00-constitution/scripts/dashboard/template.js" "iikit-00-constitution"
apply_html_patch "$SKILLS_DIR/iikit-00-constitution/scripts/dashboard/template.js" "iikit-00-constitution"

# ─── Phase 3: Copy canonical to all other skills ───
echo ""
echo "Phase 3: Distributing phase variant to 10 remaining skills"
CANONICAL="$SKILLS_DIR/iikit-00-constitution/scripts/dashboard/template.js"
PHASE_SKILLS=(
  iikit-01-specify iikit-02-plan iikit-03-checklist iikit-04-testify
  iikit-05-tasks iikit-06-analyze iikit-07-implement iikit-08-taskstoissues
  iikit-bugfix iikit-clarify
)

for skill in "${PHASE_SKILLS[@]}"; do
  target="$SKILLS_DIR/$skill/scripts/dashboard/template.js"
  if [[ -f "$target" ]]; then
    if $DRY_RUN; then
      echo "  DRY-RUN: would copy canonical → $skill"
    else
      cp "$CANONICAL" "$target"
      echo "  Copied: $skill"
    fi
  fi
done

echo ""
echo "Brand overlay complete."
echo "Run 'bash scripts/verify-brand.sh' to validate."
