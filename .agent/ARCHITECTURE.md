# JM Agentic Development Kit — Architecture (BETA)

> MetodologIA · Analyze like MAO · Develop like SA · Deploy to Hostinger
> Made with Claude Code and Tons of Love with the Help of Pristino Agent

---

## Overview

A dual-mode agentic system merging **MAO's analysis power** with **SA's development power**, reinforced by **Intent Integrity Chain metacognition**.

- **101 Skills** — MOAT pattern (reference/, prompts/, examples/, tests/)
- **101 Agents** — Specialist AI personas across 11 domains
- **101 Workflows** — Slash command pipelines
- **12 IIC Skills** — Metacognition, confidence scoring, artifact integrity
- **Stack**: Firebase, HTML/CSS/JS, Node.js, Angular, React, Google ecosystem
- **Deploy**: Hostinger + Firebase Hosting

---

## Directory Structure

```
.agent/
├── ARCHITECTURE.md
├── agents/              # 101 agents
├── skills/              # 101 MOAT skills + 12 IIC skills
│   ├── NNN-{name} {Category}/
│   │   ├── SKILL.md
│   │   ├── reference/
│   │   ├── prompts/
│   │   ├── examples/
│   │   └── tests/
│   └── iic-{name}/     # Intent Integrity Chain
├── workflows/           # 101 + 12 workflows
├── rules/               # R-001 to R-008
├── sops/                # 3 SOPs
├── scripts/             # BM25 search, validation, state machine
└── .shared/             # Stack refs, design tokens
.specify/                # Artifact state management
├── plans/               # plan-YYYY-MM-DD-{task}.md
├── adrs/                # ADR-NNN-{title}.md
├── decisions/           # DL-NNN-{decision}.md
├── requirements/        # RQL-NNN-{requirement}.md
├── context.json
└── score-history.json
```

---

## Dual-Mode Architecture

```
User Request → Kit Orchestrator → Mode Detection (R-004)
                                       ↓
              ┌────────────────┐  ┌─────────────────┐
              │ ANALYSIS MODE  │  │ DEVELOPMENT MODE │
              │ (MAO DNA)      │  │ (SA DNA)         │
              │ Skills 009-023 │  │ Skills 024-101   │
              │ Agents 009-025 │  │ Agents 026-101   │
              └───────┬────────┘  └────────┬─────────┘
                      └──────┬─────────────┘
                             ↓
                   IIC Metacognition Layer
                   (Confidence ≥ 0.95)
                             ↓
                      Quality Gates
                   G0 → G1 → G2 → G3
```

---

## Skills (101 + 12 IIC)

### Core & Orchestration (001-008)
| # | Skill | Purpose |
|---|-------|---------|
| 001 | skill-forge | Creates new 10x skills with MOAT pattern |
| 002 | workflow-forge | Creates workflows |
| 003 | kit-orchestrator | Routes analysis ↔ development |
| 004 | scope-guard | Enforces Firebase/Hostinger constraints |
| 005 | quality-gatekeeper | Validates gates G0-G3 |
| 006 | context-optimizer | Token budget management |
| 007 | session-manager | Pipeline state via context.json |
| 008 | output-contract-enforcer | Output validation |

### Analysis & Discovery (009-023)
| # | Skill | Purpose |
|---|-------|---------|
| 009 | input-analysis | Parse inputs, detect gaps |
| 010 | asis-analysis | Current-state 10-section assessment |
| 011 | flow-mapping | DDD taxonomy + E2E flows |
| 012 | functional-spec | Specs with Firebase data models |
| 013 | stakeholder-mapping | Influence/interest + RACI |
| 014 | scenario-analysis | Multi-scenario trade-offs |
| 015 | risk-assessment | 7-category risk register |
| 016 | competitive-intelligence | Market/competitor analysis |
| 017 | cost-estimation | FTE-months (never prices) |
| 018 | technical-feasibility | 7-dimension feasibility |
| 019 | discovery-orchestrator | Pipeline coordination |
| 020 | assumption-log | Track/validate assumptions |
| 021 | dependency-analysis | Critical path + integrations |
| 022 | user-story-writer | Requirements → stories |
| 023 | product-strategy | Vision + roadmap |

### Architecture & Design (024-035)
| # | Skill | Purpose |
|---|-------|---------|
| 024 | firebase-architecture | Firestore + Functions + Hosting design |
| 025 | api-designer | REST/GraphQL for Cloud Functions |
| 026 | database-architecture | Firestore modeling |
| 027 | auth-architecture | Firebase Auth + RBAC |
| 028 | state-management-design | Redux/NgRx + Firebase real-time |
| 029 | component-designer | Atomic design patterns |
| 030 | system-design | End-to-end architecture |
| 031 | data-flow-architecture | Real-time sync + triggers |
| 032 | integration-architecture | Google APIs + third-party |
| 033 | pwa-architecture | Service workers + offline |
| 034 | responsive-design-system | Tokens + grid + theming |
| 035 | architecture-tobe | TO-BE from AS-IS |

### Frontend (036-050)
| # | Skill | Purpose |
|---|-------|---------|
| 036 | scaffold-html-css | Production HTML/CSS/JS |
| 037 | scaffold-react-app | React + Firebase |
| 038 | scaffold-angular-app | Angular + AngularFire |
| 039 | css-architecture | BEM/utility-first + custom props |
| 040 | html-semantic-builder | Semantic HTML5 + ARIA |
| 041 | javascript-patterns | Modern JS + Web APIs |
| 042 | react-component-library | Storybook + tests |
| 043 | angular-module-builder | Modules + services |
| 044 | form-builder | Complex forms + Firebase |
| 045 | animation-motion | CSS animations + Lottie |
| 046 | spa-routing | React/Angular Router + rewrites |
| 047 | ui-kit-builder | Design-token components |
| 048 | data-visualization | Charts + Firebase data |
| 049 | email-template-builder | Responsive HTML emails |
| 050 | landing-page-builder | High-conversion + SEO |

### Backend (051-062)
| # | Skill | Purpose |
|---|-------|---------|
| 051 | firebase-functions | Cloud Functions triggers |
| 052 | node-api-builder | Express API |
| 053 | firebase-extensions | Email, Stripe, resize |
| 054 | server-middleware | Auth, CORS, rate limiting |
| 055 | background-jobs | Cloud Tasks + Pub/Sub |
| 056 | webhook-handler | Receive/send webhooks |
| 057 | file-storage | Cloud Storage patterns |
| 058 | notification-service | FCM + email + in-app |
| 059 | google-apis-integration | Sheets, Maps, Calendar |
| 060 | error-handling-patterns | Centralized errors + logging |
| 061 | caching-strategy | CDN + offline persistence |
| 062 | serverless-patterns | Fan-out, saga, event sourcing |

### Database & Data (063-070)
| # | Skill | Purpose |
|---|-------|---------|
| 063 | firestore-schema-design | Document/collection design |
| 064 | firestore-security-rules | Rules authoring |
| 065 | realtime-database | RTDB patterns |
| 066 | data-migration | Import/export/evolution |
| 067 | data-validation | Zod/Joi + rules validation |
| 068 | analytics-implementation | GA4 + BigQuery export |
| 069 | search-implementation | Algolia/Typesense sync |
| 070 | backup-recovery | Export/import/scheduled |

### Auth & Security (071-078)
| # | Skill | Purpose |
|---|-------|---------|
| 071 | firebase-auth-setup | Providers + MFA + sessions |
| 072 | role-based-access | Custom claims RBAC |
| 073 | oauth-social-login | Google/Facebook/GitHub/Apple |
| 074 | web-security-implementation | OWASP + CSP + XSS |
| 075 | api-security | App Check + rate limiting |
| 076 | secrets-management | Secret Manager + .env |
| 077 | privacy-compliance | GDPR/CCPA |
| 078 | penetration-testing-guide | Security audit checklist |

### Testing & Quality (079-087)
| # | Skill | Purpose |
|---|-------|---------|
| 079 | unit-testing | Jest/Vitest + emulator |
| 080 | integration-testing | Emulator suite |
| 081 | e2e-testing | Cypress/Playwright |
| 082 | accessibility-audit | WCAG 2.1 AA |
| 083 | code-review-checklist | Structured review |
| 084 | quality-metrics | Coverage + Lighthouse |
| 085 | test-data-factory | Firestore seed scripts |
| 086 | visual-regression-testing | Percy/Chromatic |
| 087 | firebase-emulator-setup | Emulator Suite config |

### DevOps & Deployment (088-095)
| # | Skill | Purpose |
|---|-------|---------|
| 088 | hostinger-deployment | Static + Node.js deploy |
| 089 | firebase-hosting-setup | Deploy + preview channels |
| 090 | ci-cd-pipeline | GitHub Actions |
| 091 | environment-management | Dev/staging/prod |
| 092 | monitoring-alerting | Crashlytics + logging |
| 093 | domain-dns-setup | DNS + SSL + CDN |
| 094 | release-strategy | Versioning + feature flags |
| 095 | build-optimization | Vite/Webpack tuning |

### Performance & SEO (096-100)
| # | Skill | Purpose |
|---|-------|---------|
| 096 | web-performance | Core Web Vitals |
| 097 | seo-technical | Structured data + sitemap |
| 098 | image-optimization | WebP/AVIF + lazy load |
| 099 | bundle-analysis | Chunk splitting |
| 100 | firebase-cost-optimization | Read/write reduction |

### Documentation (101)
| # | Skill | Purpose |
|---|-------|---------|
| 101 | technical-documentation | README + API docs + ADRs |

### IIC Metacognition (12 skills)
| Skill | Purpose |
|-------|---------|
| iic-constitution | Governance principles |
| iic-specify | FR-XXX, US-X, SC-XXX specs |
| iic-plan-generator | Plans with decision tables |
| iic-checklist-generator | Phase QA checklists |
| iic-testify | Gherkin .feature (hash-locked) |
| iic-task-decomposer | [T###] [P?] [US#] tasks |
| iic-artifact-analyzer | Cross-artifact health score |
| iic-implement | Red-green-verify cycle |
| iic-tasks-to-issues | Tasks → GitHub Issues |
| iic-core-engine | State machine + next-step |
| iic-bugfix | Bug tracking |
| iic-clarify | Socratic debate |

---

## Agents (101)

| Range | Category | Count |
|-------|----------|-------|
| 001-008 | Core & Orchestration | 8 |
| 009-025 | Analysis & Discovery | 17 |
| 026-037 | Architecture & Design | 12 |
| 038-052 | Frontend Development | 15 |
| 053-063 | Backend Development | 11 |
| 064-070 | Database & Data | 7 |
| 071-076 | Security | 6 |
| 077-084 | Testing & Quality | 8 |
| 085-093 | DevOps & Deployment | 9 |
| 094-101 | Performance & Docs | 8 |

---

## Governance

### Rules (8)
R-001 Evidence Tagging · R-002 Firebase Stack · R-003 Hostinger Constraints · R-004 Skill Selection · R-005 Quality Gates · R-006 Dual Mode · R-007 Code Standards · R-008 Output Standards

### Quality Gates
G0 (pre-flight) → G1 (analysis) → G2 (architecture) → G3 (deploy)

### Metacognition
DECOMPOSE → SOLVE → VERIFY → SYNTHESIZE → REFLECT (confidence ≥ 0.95)

---

## Statistics

| Metric | Value |
|--------|-------|
| Skills | 101 + 12 IIC = 113 |
| Agents | 101 |
| Workflows | 101 + 12 IIC |
| Rules | 8 |
| Quality Gates | 4 (G0-G3) |
| Stack | Firebase + Google + Hostinger |
| Metacognition | ≥ 0.95 confidence |

---

*MetodologIA · JM Labs · Javier Montaño · 2026*
*Based on intent-integrity-chain/kit + Antigravity Kit*
