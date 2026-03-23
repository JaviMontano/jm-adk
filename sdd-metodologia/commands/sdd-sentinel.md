---
description: "SDD — Start/stop/status the heartbeat sentinel agent"
user-invocable: true
---

# /sdd:sentinel

Manage the SDD Sentinel — an autonomous heartbeat agent that monitors project health.

## Subcommands

### start [--interval <minutes>]

Start the sentinel as a persistent scheduled task. Default interval: 45 minutes.

**Protocol:**
1. Read HEARTBEAT.md for the perceive-decide-act checklist
2. Create a persistent scheduled task via `mcp__scheduled-tasks__create_scheduled_task`:
   - taskId: `sdd-sentinel`
   - cronExpression: computed from interval (e.g., `*/45 * * * *` for 45min)
   - prompt: The sentinel perceive-decide-act cycle:
     ```
     You are the SDD Sentinel. Read HEARTBEAT.md and execute the perceive-decide-act cycle:
     1. Run: bash scripts/sdd-sentinel.sh . --json
     2. If output contains "HEARTBEAT_OK": do nothing, respond "HEARTBEAT_OK"
     3. If output contains findings:
        a. Run: node scripts/sdd-insights.js . --snapshot
        b. Review findings and propose /sdd: commands
        c. Report findings concisely to user
     ```
3. Write `.specify/sentinel-state.json` with enabled=true
4. Confirm: "Sentinel started. Checking every {interval} minutes."

### stop

Disable the sentinel. Uses `mcp__scheduled-tasks__update_scheduled_task` with enabled=false.
Update `.specify/sentinel-state.json` with enabled=false.

### status

Read `.specify/sentinel-state.json` and display:
- Enabled/disabled state
- Last run timestamp
- Total run count
- Last findings count
- Next scheduled run

### report

Display the last `.specify/HEARTBEAT-REPORT.md` if it exists.
If not, suggest running `/sdd:sentinel start` first.

## Notes

- The sentinel is **cost-optimized**: PERCEIVE and DECIDE are pure shell (zero LLM cost)
- LLM is only invoked when genuine anomalies are found
- Persistent tasks survive app restarts (stored at ~/.claude/scheduled-tasks/)
- Sentinel auto-suppresses after clean runs (no spam)
