#!/usr/bin/env bash
# sdd-session-log.sh — Append events to .specify/session-log.json
#
# Usage:
#   bash scripts/sdd-session-log.sh <type> <description> [command] [project-path]
#
# Types: command, file_created, file_modified, sentinel, dashboard, capture, init
#
# Example:
#   bash scripts/sdd-session-log.sh command "Ran /sdd:spec for feature 001" "/sdd:spec" .

set -euo pipefail

TYPE="${1:-}"
DESCRIPTION="${2:-}"
COMMAND="${3:-}"
PROJECT_PATH="${4:-.}"

if [[ -z "$TYPE" || -z "$DESCRIPTION" ]]; then
  echo "Usage: sdd-session-log.sh <type> <description> [command] [project-path]"
  exit 1
fi

SPECIFY_DIR="$PROJECT_PATH/.specify"
LOG_FILE="$SPECIFY_DIR/session-log.json"

mkdir -p "$SPECIFY_DIR"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Read existing or create new
if [[ -f "$LOG_FILE" ]]; then
  EXISTING=$(cat "$LOG_FILE")
else
  EXISTING='{"events":[]}'
fi

# Append event using python3 (portable JSON handling)
python3 -c "
import json, sys

data = json.loads('''$EXISTING''')
if 'events' not in data:
    data['events'] = []

event = {
    'timestamp': '$TIMESTAMP',
    'type': '$TYPE',
    'description': '''$DESCRIPTION''',
}
if '''$COMMAND''':
    event['command'] = '''$COMMAND'''

data['events'].append(event)

# Cap at 200 events (FIFO)
if len(data['events']) > 200:
    data['events'] = data['events'][-200:]

with open('$LOG_FILE', 'w') as f:
    json.dump(data, f, indent=2)
" 2>/dev/null

# Silent success — this is a background utility
