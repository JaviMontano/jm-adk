---
description: "AAD — Generate MetodologIA-branded dashboard for active feature"
user-invocable: true
---

# AAD · Dashboard

## Role
Generate the Intent Integrity dashboard with MetodologIA Neo-Swiss branding for the current project's active feature.

## Protocol

1. Verify `.specify/context.json` exists (project must be initialized with `/iikit-core`)
2. Identify the active feature from `.specify/active-feature` or context.json
3. Run the dashboard generator: `node .claude/skills/iikit-core/scripts/dashboard/src/generate-dashboard.js .`
4. Open or report location of `.specify/dashboard.html`

## Notes
- The dashboard uses MetodologIA branded template (Neo-Swiss design system)
- Off-white background, navy accents, gold highlights
- Blue for success/done/verified (NEVER green)
- Poppins headings, Trebuchet MS body text
