---
description: "SDD — Generate MetodologIA-branded dashboard for active feature"
user-invocable: true
---

# SDD · Dashboard

## Role
Generate the Intent Integrity dashboard with MetodologIA Neo-Swiss branding for the current project's active feature.

## Protocol

1. Verify the project has been initialized (`.specify/` directory exists)
2. Run the MetodologIA dashboard generator:
   ```bash
   node scripts/generate-dashboard.js . --output .specify/dashboard.html
   ```
   (scripts/ is relative to the plugin root at ~/skills/plugins/iic-metodologia/)
3. If the generator script is not available, fall back to the upstream generator:
   ```bash
   node .claude/skills/iikit-core/scripts/dashboard/src/generate-dashboard.js .
   ```
4. Report the dashboard location: `.specify/dashboard.html`
5. If the user wants to view it, suggest opening in browser

## Design System
- **Template**: `scripts/dashboard-template.html` (Neo-Swiss premium dark)
- **Tokens**: `references/design-tokens.json` (canonical source)
- Body: ultra-dark #020617, glassmorphism cards, gold accents
- Blue #137DC5 for done/verified (NEVER green)
- Poppins headings, Montserrat body, JetBrains Mono code
- Logo: MetodologIA SVG (gradient navy box + white bars + gold dot)
