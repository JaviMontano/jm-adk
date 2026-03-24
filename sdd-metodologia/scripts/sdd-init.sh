#!/usr/bin/env bash
# sdd-init.sh — MetodologIA SDD project initialization wrapper
# Delegates to upstream init-project.sh, then applies SDD branding layer.
#
# Usage: bash scripts/sdd-init.sh [project-path]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_PATH="${1:-.}"

# Colors
GOLD='\033[38;5;220m'
BLUE='\033[38;5;33m'
NAVY='\033[38;5;17m'
WHITE='\033[1;37m'
MUTED='\033[38;5;245m'
RESET='\033[0m'
BOLD='\033[1m'

# ─── Banner ───
echo ""
echo -e "${GOLD}╔══════════════════════════════════════════════════════╗${RESET}"
echo -e "${GOLD}║${RESET}  ${WHITE}${BOLD}SDD${RESET} — Spec Driven Development               ${GOLD}║${RESET}"
echo -e "${GOLD}║${RESET}  ${MUTED}by metodolog${GOLD}IA${RESET}                                    ${GOLD}║${RESET}"
echo -e "${GOLD}║${RESET}  ${MUTED}Specification-driven · BDD verified · Neo-Swiss${RESET}    ${GOLD}║${RESET}"
echo -e "${GOLD}╚══════════════════════════════════════════════════════╝${RESET}"
echo ""

# ─── Step 1: Run upstream init if available ───
UPSTREAM_INIT="$ROOT_DIR/.claude/skills/iikit-core/scripts/bash/init-project.sh"
if [[ -x "$UPSTREAM_INIT" ]]; then
  echo -e "${BLUE}Step 1:${RESET} Running upstream IIC/kit init..."
  bash "$UPSTREAM_INIT" --json "$PROJECT_PATH" 2>/dev/null || true
  echo -e "  ${MUTED}Upstream init complete${RESET}"
else
  echo -e "${MUTED}Step 1: Upstream init-project.sh not found (standalone mode)${RESET}"
fi

# ─── Step 2: Create .specify/ with SDD metadata ───
SPECIFY_DIR="$PROJECT_PATH/.specify"
mkdir -p "$SPECIFY_DIR"

if [[ ! -f "$SPECIFY_DIR/context.json" ]]; then
  cat > "$SPECIFY_DIR/context.json" << 'CTXEOF'
{
  "version": "1.0.0",
  "brand": "MetodologIA",
  "product": "SDD",
  "created": "TIMESTAMP",
  "features": [],
  "activeFeature": null,
  "pipeline": {
    "currentPhase": "init",
    "completedPhases": []
  }
}
CTXEOF
  # Replace timestamp
  if command -v python3 &>/dev/null; then
    TS=$(python3 -c "from datetime import datetime; print(datetime.utcnow().isoformat() + 'Z')")
  else
    TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  fi
  sed -i '' "s/TIMESTAMP/$TS/" "$SPECIFY_DIR/context.json" 2>/dev/null || sed -i "s/TIMESTAMP/$TS/" "$SPECIFY_DIR/context.json"
  echo -e "${BLUE}Step 2:${RESET} Created .specify/context.json"
else
  echo -e "${MUTED}Step 2: .specify/context.json already exists${RESET}"
fi

# ─── Step 3: Check for CONSTITUTION.md ───
if [[ -f "$PROJECT_PATH/CONSTITUTION.md" ]]; then
  echo -e "${BLUE}Step 3:${RESET} CONSTITUTION.md found ${GOLD}✓${RESET}"
else
  echo -e "${MUTED}Step 3: No CONSTITUTION.md — run /sdd:00-constitution to create${RESET}"
fi

# ─── Step 4: Check for PREMISE.md ───
if [[ -f "$PROJECT_PATH/PREMISE.md" ]]; then
  echo -e "${BLUE}Step 4:${RESET} PREMISE.md found ${GOLD}✓${RESET}"
else
  echo -e "${MUTED}Step 4: No PREMISE.md — run /sdd:core init to create${RESET}"
fi

# ─── Step 5: Deploy ALM (Application Lifecycle Manager) ───
echo -e "${BLUE}Step 5:${RESET} Deploying ALM visual components..."

ALM_DIR="$SPECIFY_DIR"
ALM_SHARED="$ALM_DIR/shared"
mkdir -p "$ALM_SHARED" "$ALM_DIR/docs/shared"

# 5a. Generate dashboard.html (single-file legacy)
DASHBOARD_GENERATOR="$SCRIPT_DIR/generate-dashboard.js"
if [[ -f "$DASHBOARD_GENERATOR" ]] && command -v node &>/dev/null; then
  node "$DASHBOARD_GENERATOR" "$PROJECT_PATH" 2>/dev/null && echo -e "  ${GOLD}✓${RESET} dashboard.html" || true
fi

# 5b. Copy Command Center (index.html + shared/)
CC_SRC="$SCRIPT_DIR/command-center"
if [[ -d "$CC_SRC" ]]; then
  cp "$CC_SRC/index.html" "$ALM_DIR/" 2>/dev/null
  cp "$CC_SRC/shared/nav.js" "$ALM_SHARED/" 2>/dev/null
  cp "$CC_SRC/shared/tokens.css" "$ALM_SHARED/" 2>/dev/null
  echo -e "  ${GOLD}✓${RESET} Command Center (index.html + shared/)"
fi

# 5c. Generate data.js for Command Center
CC_DATA_GEN="$SCRIPT_DIR/generate-command-center-data.js"
if [[ -f "$CC_DATA_GEN" ]] && command -v node &>/dev/null; then
  node "$CC_DATA_GEN" "$PROJECT_PATH" 2>/dev/null && echo -e "  ${GOLD}✓${RESET} shared/data.js" || true
fi

# 5d. Copy Tour
if [[ -f "$SCRIPT_DIR/sdd-tour.html" ]]; then
  cp "$SCRIPT_DIR/sdd-tour.html" "$ALM_DIR/tour.html"
  echo -e "  ${GOLD}✓${RESET} tour.html (8-step onboarding)"
fi

# 5e. Copy Landing
if [[ -f "$ROOT_DIR/landing.html" ]]; then
  cp "$ROOT_DIR/landing.html" "$ALM_DIR/landing.html"
  echo -e "  ${GOLD}✓${RESET} landing.html"
fi

# 5f. Copy Docs site
DOCS_SRC="$ROOT_DIR/docs"
if [[ -d "$DOCS_SRC" ]]; then
  cp "$DOCS_SRC"/*.html "$ALM_DIR/docs/" 2>/dev/null
  cp "$DOCS_SRC"/shared/*.js "$ALM_DIR/docs/shared/" 2>/dev/null
  cp "$DOCS_SRC"/shared/*.css "$ALM_DIR/docs/shared/" 2>/dev/null
  DOC_COUNT=$(ls "$ALM_DIR/docs/"*.html 2>/dev/null | wc -l | tr -d ' ')
  echo -e "  ${GOLD}✓${RESET} docs/ ($DOC_COUNT pages)"
fi

# 5g. Create shared/footer.js if missing
if [[ ! -f "$ALM_SHARED/footer.js" ]]; then
  cat > "$ALM_SHARED/footer.js" << 'FOOTEREOF'
(function(){
  var f=document.createElement('footer');
  f.style.cssText='margin-top:4rem;padding:1.5rem 2rem;background:#122562;border-top:4px solid #FFD700;text-align:center;font-size:0.75rem;color:#94A3B8';
  f.innerHTML='SDD v3.0 &middot; Spec Driven Development by metodolog<span style="color:#FFD700;font-weight:700">IA</span><br>&copy; 2026 MetodologIA &middot; Javier Montano';
  document.body.appendChild(f);
})();
FOOTEREOF
  echo -e "  ${GOLD}✓${RESET} shared/footer.js"
fi

echo -e "  ${MUTED}Serve locally: npx serve .specify/ -p 3001${RESET}"

# ─── Step 6: GitHub Sync ───
GIT_DIR="$PROJECT_PATH/.git"
if [[ -d "$GIT_DIR" ]]; then
  # Existing git repo — check remote sync
  REMOTE=$(cd "$PROJECT_PATH" && git remote get-url origin 2>/dev/null || echo "")
  if [[ -n "$REMOTE" ]]; then
    echo -e "${BLUE}Step 6:${RESET} Git repo with remote: ${MUTED}${REMOTE}${RESET}"
    # Fetch and check divergence
    (cd "$PROJECT_PATH" && git fetch --quiet 2>/dev/null) || true
    LOCAL_HEAD=$(cd "$PROJECT_PATH" && git rev-parse HEAD 2>/dev/null || echo "unknown")
    REMOTE_HEAD=$(cd "$PROJECT_PATH" && git rev-parse @{u} 2>/dev/null || echo "unknown")
    if [[ "$LOCAL_HEAD" = "$REMOTE_HEAD" ]]; then
      echo -e "  ${GOLD}✓${RESET} Sync OK — local matches remote"
    elif [[ "$REMOTE_HEAD" = "unknown" ]]; then
      echo -e "  ${MUTED}⚠ No upstream tracking branch set${RESET}"
    else
      BEHIND=$(cd "$PROJECT_PATH" && git rev-list --count HEAD..@{u} 2>/dev/null || echo "?")
      AHEAD=$(cd "$PROJECT_PATH" && git rev-list --count @{u}..HEAD 2>/dev/null || echo "?")
      echo -e "  ${GOLD}⚠${RESET} Diverged: ${AHEAD} ahead, ${BEHIND} behind remote"
    fi
  else
    echo -e "${BLUE}Step 6:${RESET} Git repo found but ${MUTED}no remote configured${RESET}"
    echo -e "  ${MUTED}Tip: git remote add origin <url> to enable sync${RESET}"
  fi
else
  echo -e "${MUTED}Step 6: No git repo — run 'git init' to enable version control${RESET}"
fi

# ─── Step 7: Ensure .gitignore ───
GITIGNORE="$PROJECT_PATH/.gitignore"
if [[ -d "$GIT_DIR" ]] && [[ ! -f "$GITIGNORE" ]]; then
  cat > "$GITIGNORE" << 'GIEOF'
# SDD — Spec Driven Development
# Generated files and transient state

# Workspace (user interaction layer)
workspace/

# Sentinel transient state (regenerated per-run)
.specify/sentinel-state.json
.specify/dashboard.html
.specify/dashboard/

# Node.js
node_modules/

# OS
.DS_Store
Thumbs.db
GIEOF
  echo -e "${BLUE}Step 7:${RESET} Created .gitignore with SDD defaults"
elif [[ -f "$GITIGNORE" ]]; then
  echo -e "${MUTED}Step 7: .gitignore already exists${RESET}"
fi

# ─── Step 8: Initialize sentinel state ───
bash "$SCRIPT_DIR/sdd-heartbeat-lite.sh" --init 2>/dev/null || true

# ─── Summary ───
echo ""
echo -e "${GOLD}─────────────────────────────────────────────${RESET}"
echo -e "${WHITE}${BOLD}Next Steps:${RESET}"
echo -e "  ${GOLD}1.${RESET} /sdd:00-constitution  ${MUTED}— Define governance principles${RESET}"
echo -e "  ${GOLD}2.${RESET} /sdd:spec             ${MUTED}— Specify your first feature${RESET}"
echo -e "  ${GOLD}3.${RESET} /sdd:plan             ${MUTED}— Create technical design${RESET}"
echo -e "  ${GOLD}4.${RESET} /sdd:dashboard         ${MUTED}— Open Command Center${RESET}"
echo -e "  ${GOLD}5.${RESET} /sdd:tour             ${MUTED}— Guided onboarding tour${RESET}"
echo -e "  ${GOLD}6.${RESET} /sdd:menu             ${MUTED}— See all available commands${RESET}"
echo ""
echo -e "${MUTED}Project: $(cd "$PROJECT_PATH" && pwd)${RESET}"
echo -e "${MUTED}SDD v3.0 · MetodologIA · $(date +%Y-%m-%d)${RESET}"
