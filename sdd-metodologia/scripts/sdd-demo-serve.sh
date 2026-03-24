#!/usr/bin/env bash
# sdd-demo-serve.sh — Deploy ALM with demo data for certification testing
# Usage: bash scripts/sdd-demo-serve.sh [port]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PORT="${1:-3001}"

DEMO_DIR=$(mktemp -d)
echo "Deploying ALM demo to $DEMO_DIR..."

# Copy all command center pages
cp "$SCRIPT_DIR/command-center/"*.html "$DEMO_DIR/" 2>/dev/null
mkdir -p "$DEMO_DIR/shared"
cp "$SCRIPT_DIR/command-center/shared/tokens.css" "$DEMO_DIR/shared/"
cp "$SCRIPT_DIR/command-center/shared/nav.js" "$DEMO_DIR/shared/"
cp "$SCRIPT_DIR/command-center/shared/footer.js" "$DEMO_DIR/shared/"

# Use DEMO data instead of real data
cp "$SCRIPT_DIR/command-center/demo-data.js" "$DEMO_DIR/shared/data.js"

# Copy tour + landing
cp "$SCRIPT_DIR/sdd-tour.html" "$DEMO_DIR/tour.html" 2>/dev/null
cp "$ROOT_DIR/landing.html" "$DEMO_DIR/landing.html" 2>/dev/null

# Copy docs
mkdir -p "$DEMO_DIR/docs/shared"
cp "$ROOT_DIR/docs/"*.html "$DEMO_DIR/docs/" 2>/dev/null
cp "$ROOT_DIR/docs/shared/"*.js "$DEMO_DIR/docs/shared/" 2>/dev/null
cp "$ROOT_DIR/docs/shared/"*.css "$DEMO_DIR/docs/shared/" 2>/dev/null

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  SDD ALM — Demo Mode                                ║"
echo "║  4 features · 78% health · QuizMaster EdTech        ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "Pages:"
echo "  http://localhost:$PORT/              → Command Center Hub"
echo "  http://localhost:$PORT/pipeline.html → Pipeline + Kanban"
echo "  http://localhost:$PORT/specs.html    → Specifications"
echo "  http://localhost:$PORT/quality.html  → Quality Gates"
echo "  http://localhost:$PORT/intelligence.html → Intelligence"
echo "  http://localhost:$PORT/workspace.html → Workspace"
echo "  http://localhost:$PORT/governance.html → Governance"
echo "  http://localhost:$PORT/tour.html     → Onboarding Tour"
echo ""
echo "Starting server..."
npx serve "$DEMO_DIR" -p "$PORT" -s
