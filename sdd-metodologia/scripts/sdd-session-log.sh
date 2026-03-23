#!/usr/bin/env bash
# sdd-session-log.sh — Append events to .specify/session-log.json
# MUST exit 0 always — background utility called from hooks.

TYPE="${1:-}"
DESCRIPTION="${2:-}"
COMMAND="${3:-}"
PROJECT_PATH="${4:-.}"

# Silent exit if no type or not an SDD project
[ -z "$TYPE" ] && exit 0
[ -d "$PROJECT_PATH/.specify" ] || exit 0

LOG_FILE="$PROJECT_PATH/.specify/session-log.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "unknown")
[ -z "$DESCRIPTION" ] && DESCRIPTION="Hook: $TYPE"
[ -f "$LOG_FILE" ] || echo '{"events":[]}' > "$LOG_FILE"

# Use env vars to pass data safely to python (no string interpolation)
SDD_LOG_FILE="$LOG_FILE" \
SDD_TIMESTAMP="$TIMESTAMP" \
SDD_TYPE="$TYPE" \
SDD_DESC="$DESCRIPTION" \
SDD_CMD="$COMMAND" \
python3 -c '
import json, os

log_file = os.environ["SDD_LOG_FILE"]
try:
    with open(log_file, "r") as f:
        data = json.load(f)
except Exception:
    data = {"events": []}

if "events" not in data:
    data["events"] = []

event = {
    "timestamp": os.environ["SDD_TIMESTAMP"],
    "type": os.environ["SDD_TYPE"],
    "description": os.environ["SDD_DESC"],
}
cmd = os.environ.get("SDD_CMD", "")
if cmd:
    event["command"] = cmd

data["events"].append(event)
if len(data["events"]) > 200:
    data["events"] = data["events"][-200:]

tmp = log_file + ".tmp"
with open(tmp, "w") as f:
    json.dump(data, f, indent=2)
os.rename(tmp, log_file)
' 2>/dev/null || true

exit 0
