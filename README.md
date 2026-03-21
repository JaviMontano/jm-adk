# JM Agentic Development Kit (BETA)

> **Pristino Agent** · Analyze like MAO · Develop like SA · Think with Metacognition
>
> Made with Claude Code and Tons of Love with the Help of Pristino Agent

---

## What is JM-ADK?

A **world-class dual-mode agentic development toolkit** powered by Pristino, an AI assistant that combines:

- **142 Skills** — From requirements analysis to production deployment
- **101 Agents** — Specialist AI personas across 13 domains
- **101 Workflows** — Slash command automation pipelines
- **12 IIC Metacognition Skills** — Intent integrity with confidence >= 0.95
- **6 Meta Skills** — Skills that create, review, search, and deploy other skills

### Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | HTML5, CSS3, Vanilla JS, Angular 18+, React 19+ |
| Backend | Firebase Cloud Functions, Node.js 20 |
| Database | Firestore, Firebase RTDB |
| Auth | Firebase Auth, Custom Claims, RBAC |
| Hosting | Firebase Hosting, Hostinger |
| CI/CD | GitHub Actions |
| Google APIs | Sheets, Docs, Calendar, Maps |
| Metacognition | Intent Integrity Chain (confidence >= 0.95) |
| MCP | Tessl tile-based capabilities |

---

## Quick Start

```bash
# 1. Clone the kit
git clone https://github.com/jmontanoz/jm-agentic-development-kit.git
cd jm-agentic-development-kit

# 2. Open with your AI assistant (Claude, Gemini, etc.)
# Pristino will greet you and start the onboarding protocol automatically.

# 3. Search for skills
python .agent/scripts/search_skills.py "firebase auth"

# 4. Validate all skills
python .agent/scripts/validate_skills.py

# 5. View the dashboard
open .specify/dashboard.html
```

---

## Pristino — Your Assistant

When you open this project with an AI agent, **Pristino** activates automatically:

1. **Greets you** and presents capabilities
2. **Checks logs** — scans for existing plans, ADRs, decisions, requirements
3. **Verifies MCP** — checks Tessl configuration
4. **Certifies skills** — reports kit health (142 skills across 13 domains)
5. **Converses** — Socratic discovery to understand what you want to build
6. **Routes** — sets Analysis mode (MAO DNA) or Development mode (SA DNA)

---

## Two Modes of Operation

**Analysis Mode (MAO DNA)** — Skills 009-023
```
/jm:analyze-requirements → /jm:assess-asis → /jm:map-flows → /jm:write-spec
```

**Development Mode (SA DNA)** — Skills 024-101
```
/jm:scaffold-firebase → /jm:create-component → /jm:test-unit → /jm:deploy-hostinger
```

**Meta Mode** — Self-improving skills
```
/jm:create-skill → /jm:review-skill → /jm:search-skill
```

---

## Metacognition (Intent Integrity Chain)

Every complex response follows:
```
DECOMPOSE → SOLVE → VERIFY → SYNTHESIZE → REFLECT
```

- **Minimum confidence**: 0.95
- **Below threshold**: Socratic debate + internet fact-checking
- **Hash integrity**: SHA256 locked test assertions prevent requirement drift
- **Evidence tags**: [CODE] [CONFIG] [DOC] [INFERENCE] [ASSUMPTION]

---

## Governance & Artifact Management

| Artifact | Location |
|----------|----------|
| Constitution | `CONSTITUTION.md` |
| Plans | `.specify/plans/plan-YYYY-MM-DD-{task}.md` |
| ADRs | `.specify/adrs/ADR-NNN-{title}.md` |
| Decision Logs | `.specify/decisions/DL-NNN-{decision}.md` |
| Requirement Logs | `.specify/requirements/RQL-NNN-{req}.md` |
| Health Score | `.specify/score-history.json` |
| Dashboard | `.specify/dashboard.html` |
| Quality Gates | G0 → G1 → G2 → G3 |

---

## Skill Domains (142 total)

| Domain | Skills | Range |
|--------|--------|-------|
| Core & Orchestration | 8 | 001-008 |
| Analysis & Discovery | 15 | 009-023 |
| Architecture & Design | 12 | 024-035 |
| Frontend Development | 15 | 036-050 |
| Backend Development | 12 | 051-062 |
| Database & Data | 8 | 063-070 |
| Auth & Security | 8 | 071-078 |
| Testing & Quality | 9 | 079-087 |
| DevOps & Deployment | 8 | 088-095 |
| Performance & SEO | 5 | 096-100 |
| Documentation | 1 | 101 |
| IIC Metacognition | 12 | iic-* |
| Meta Skills | 6 | meta-* |

---

## MCP Configuration

Tessl MCP for enhanced tile-based capabilities:

```json
{
  "mcpServers": {
    "tessl": {
      "command": "tessl",
      "args": ["mcp", "start"]
    }
  }
}
```

---

## Commands Cheat Sheet

| Command | What it does |
|---------|-------------|
| `/jm:menu` | Show all commands |
| `/jm:status` | Pipeline status |
| `/jm:analyze-requirements` | Parse and structure requirements |
| `/jm:write-spec` | Generate functional spec |
| `/jm:design-architecture` | Firebase architecture blueprint |
| `/jm:scaffold-firebase` | Full Firebase project scaffold |
| `/jm:scaffold-react-firebase` | React + Firebase project |
| `/jm:create-component` | UI component with tests |
| `/jm:create-api` | Cloud Function endpoint |
| `/jm:test-unit` | Generate unit tests |
| `/jm:deploy-firebase` | Deploy to Firebase Hosting |
| `/jm:deploy-hostinger` | Deploy to Hostinger |
| `/jm:create-skill` | Create a new skill |
| `/jm:search-skill` | Search skills catalog |
| `/jm:full-lifecycle` | End-to-end pipeline |
| `/jm:prototype` | Rapid MVP |

---

## Credits

- **Author**: Javier Montano · MetodologIA · JM Labs
- **Assistant**: Pristino Agent
- **Based on**: [intent-integrity-chain/kit](https://github.com/intent-integrity-chain/kit)
- **Format**: [Antigravity Kit](https://github.com/vudovn/antigravity-kit)
- **Analysis DNA**: MAO (MetodologIA)
- **Development DNA**: SA (Sovereign Architect)

## License

MIT
