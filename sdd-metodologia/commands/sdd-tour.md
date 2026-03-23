---
description: "SDD — Guided onboarding tour (8-step interactive walkthrough)"
user-invocable: true
---

# /sdd:tour — Onboarding Tour

Launch the SDD onboarding experience — an 8-step interactive tour introducing the pipeline, dashboard, heartbeat, knowledge graph, and key commands.

## Steps
1. Welcome to SDD
2. The 9-Phase Pipeline
3. The Command Center (Dashboard)
4. Ambient Heartbeat
5. Knowledge Graph
6. RAG Memory
7. Key Commands
8. Ready to Start

## Usage
```
/sdd:tour           # Open tour in browser
/sdd:tour --reset   # Reset tour completion and restart
```

## Execution
Open `scripts/sdd-tour.html` in the user's default browser.
If localStorage `sdd-tour-completed` is set, the tour shows a completion message with option to restart.
