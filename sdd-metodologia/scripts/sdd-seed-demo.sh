#!/usr/bin/env bash
# SDD Demo Seed — Generate a complete demo project for testing
# Usage: bash sdd-seed-demo.sh [output-path]
# Default: /tmp/sdd-demo

set -euo pipefail

OUT="${1:-/tmp/sdd-demo}"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
GOLD='\033[38;5;220m'
BLUE='\033[38;5;33m'
MUTED='\033[38;5;245m'
WHITE='\033[1;37m'
RESET='\033[0m'

echo -e "${GOLD}SDD Demo Seed${RESET} — Generating project at ${WHITE}${OUT}${RESET}"

rm -rf "$OUT"
mkdir -p "$OUT/.specify/rag-memory" "$OUT/specs/001-auth/tests/features" \
         "$OUT/specs/001-auth/checklists" "$OUT/specs/002-quiz/tests/features" \
         "$OUT/specs/003-analytics"

# ── CONSTITUTION.md ──
cat > "$OUT/CONSTITUTION.md" << 'EOF'
# Constitution — EdTech Quiz Platform

## I. Accessibility
All UI must meet WCAG 2.1 AA. Keyboard navigation mandatory. Color contrast >= 4.5:1 for text.

## II. Security
Authentication via managed identity provider. No secrets in client code. Input sanitization at boundary. RLS on all tables.

## III. Performance
Page load < 2s on 3G. API response < 200ms p95. Offline resilience for cached content.

## IV. Maintainability
Business-readable naming. Single responsibility per module. README per directory. No dead code.

## V. Testing
TDD mandatory. Tests before code. Hash-locked .feature files. BDD scenarios cover all quality angles.

Version: 1.0.0 | Ratified: 2026-03-20
EOF

# ── PREMISE.md ──
cat > "$OUT/PREMISE.md" << 'EOF'
# Premise — EdTech Quiz Platform

## What
Interactive quiz platform for K-12 students with real-time scoring, adaptive difficulty, and teacher dashboards.

## Who
- Students (ages 10-18): Take quizzes, track progress
- Teachers: Create quizzes, view analytics, manage classes
- Admins: Platform configuration, user management

## Why
Current paper-based assessments lack immediate feedback and adaptive learning. Digital quizzes enable personalized education at scale.

## Domain
EdTech, Assessment, Learning Management

## Stack
- Frontend: HTML + CSS + Vanilla JS (client-rendered)
- Backend: Supabase (PostgreSQL + Auth + RLS)
- Hosting: Vercel (static + edge functions)
- Testing: Vitest + Playwright
EOF

# ── Feature 001: Authentication (Phase 7 — nearly complete) ──
cat > "$OUT/specs/001-auth/spec.md" << 'EOF'
# Feature: User Authentication

## Requirements
- FR-001: Students can register with email and password
- FR-002: Teachers can register with school-verified email
- FR-003: Login with email/password returns JWT token
- FR-004: Password reset via email link (expires in 1 hour)
- FR-005: Session persists across page reloads (refresh token in httpOnly cookie)

## User Stories
- US-001: As a student, I want to create an account so I can save my quiz progress
- US-002: As a teacher, I want school-verified registration so only authorized staff access teacher features
- US-003: As a user, I want to reset my password if I forget it

## Success Criteria
- SC-001: Registration completes in < 3 seconds
- SC-002: Invalid credentials show specific error (not generic "login failed")
- SC-003: JWT expires after 1 hour, refresh token after 7 days
EOF

cat > "$OUT/specs/001-auth/plan.md" << 'EOF'
# Technical Plan: Authentication

## Architecture
- Supabase Auth with email provider
- Custom RLS policies: students see own data, teachers see class data
- Edge function for school email verification (regex + allowlist)

## Data Model
- auth.users (Supabase managed)
- public.profiles (id, role, school_id, display_name, created_at)
- public.schools (id, name, domain, verified)

## API Endpoints
- POST /auth/register — Create account (role inferred from email domain)
- POST /auth/login — Returns JWT + sets refresh cookie
- POST /auth/reset — Sends password reset email
- GET /auth/me — Returns current user profile
EOF

cat > "$OUT/specs/001-auth/checklists/CL-001.md" << 'EOF'
# Checklist: Authentication Quality

- [x] FR-001 has acceptance criteria with Given/When/Then
- [x] FR-002 specifies school email verification mechanism
- [x] FR-003 defines token expiry and refresh strategy
- [x] FR-004 includes edge case: expired reset link
- [x] FR-005 specifies cookie security attributes (httpOnly, secure, sameSite)
- [x] Data model covers all entities mentioned in requirements
- [x] API endpoints map 1:1 to functional requirements
- [ ] Performance SLO for auth endpoints not defined (gap)
EOF

cat > "$OUT/specs/001-auth/tasks.md" << 'EOF'
# Tasks: Authentication

- [x] T-001: Configure Supabase Auth email provider (FR-001, FR-002)
- [x] T-002: Create profiles table with RLS policies (FR-001)
- [x] T-003: Create schools table with domain verification (FR-002)
- [x] T-004: Implement registration edge function (FR-001, FR-002)
- [x] T-005: Implement login endpoint with JWT generation (FR-003)
- [x] T-006: Implement password reset flow (FR-004)
- [x] T-007: Configure refresh token cookie settings (FR-005)
- [x] T-008: Write Playwright E2E tests for registration
- [x] T-009: Write Playwright E2E tests for login
- [x] T-010: Write Playwright E2E tests for password reset
- [ ] T-011: Add rate limiting to auth endpoints
- [ ] T-012: Add brute force protection (lockout after 5 failures)
- [ ] T-013: Implement session revocation endpoint
- [ ] T-014: Add audit logging for auth events (FR-003)
- [ ] T-015: Performance test auth endpoints under load
EOF

cat > "$OUT/specs/001-auth/tests/features/auth.feature" << 'EOF'
@TS-001 @FR-001 @US-001 @P1
Scenario: Student registers with valid email
  Given the registration page is loaded
  When I enter "student@school.edu" and a valid password
  Then my account is created and I am redirected to the quiz dashboard

@TS-002 @FR-002 @US-002 @P1
Scenario: Teacher registers with school-verified email
  Given the registration page is loaded
  When I enter "teacher@verifiedschool.edu" and a valid password
  Then my account is created with role "teacher"
  And I can access the teacher dashboard

@TS-003 @FR-003 @P1
Scenario: Login returns JWT and sets refresh cookie
  Given I have a registered account
  When I login with valid credentials
  Then I receive a JWT token expiring in 1 hour
  And a refresh token cookie is set with httpOnly and secure flags

@TS-004 @FR-004 @P2
Scenario: Password reset sends email with time-limited link
  Given I have a registered account
  When I request a password reset for my email
  Then I receive an email with a reset link
  And the link expires after 1 hour

@TS-005 @FR-004 @P2
Scenario: Expired reset link shows error
  Given I have a password reset link older than 1 hour
  When I click the reset link
  Then I see an error message "Reset link has expired"
  And I am offered to request a new reset

@TS-006 @FR-005 @P1
Scenario: Session persists across page reloads
  Given I am logged in
  When I reload the page
  Then I remain logged in via refresh token

@TS-007 @FR-003 @P2
Scenario: Invalid credentials show specific error
  Given the login page is loaded
  When I enter an incorrect password
  Then I see "Invalid email or password" (not generic error)

@TS-008 @FR-001 @P2
Scenario: Duplicate email registration is rejected
  Given "student@school.edu" is already registered
  When I try to register with the same email
  Then I see "An account with this email already exists"

@TS-009 @FR-002 @P3
Scenario: Non-school email cannot register as teacher
  Given the registration page is loaded
  When I enter "person@gmail.com" and select teacher role
  Then registration is rejected with "School email required for teacher accounts"

@TS-010 @FR-003 @P3
Scenario: Expired JWT triggers automatic refresh
  Given my JWT has expired but refresh token is valid
  When I make an API request
  Then a new JWT is issued transparently
  And my request succeeds without re-login
EOF

# ── Feature 002: Quiz Engine (Phase 4 — has spec + plan, no tests yet) ──
cat > "$OUT/specs/002-quiz/spec.md" << 'EOF'
# Feature: Quiz Engine

## Requirements
- FR-006: Teachers can create quizzes with multiple question types (MCQ, true/false, short answer)
- FR-007: Quizzes support adaptive difficulty (3 levels: easy, medium, hard)
- FR-008: Students see real-time score as they answer questions
- FR-009: Quiz results are saved with per-question breakdown
- FR-010: Teachers can set time limits per quiz (5-120 minutes)

## User Stories
- US-004: As a teacher, I want to create quizzes with mixed question types
- US-005: As a student, I want adaptive difficulty so the quiz matches my level
- US-006: As a teacher, I want to see per-question analytics for my quizzes

## Success Criteria
- SC-004: Quiz creation takes < 5 minutes for a 20-question quiz
- SC-005: Score updates within 100ms of answering a question
- SC-006: Quiz results include accuracy %, time per question, difficulty progression
EOF

cat > "$OUT/specs/002-quiz/plan.md" << 'EOF'
# Technical Plan: Quiz Engine

## Architecture
- Quizzes stored in Supabase with JSONB for flexible question schemas
- Real-time scoring via Supabase Realtime subscriptions
- Adaptive algorithm: if 3 correct in a row → increase difficulty; 2 wrong → decrease

## Data Model
- public.quizzes (id, teacher_id, title, time_limit_minutes, created_at)
- public.questions (id, quiz_id, type, difficulty, content JSONB, correct_answer JSONB)
- public.attempts (id, student_id, quiz_id, started_at, completed_at, score)
- public.answers (id, attempt_id, question_id, student_answer JSONB, is_correct, answered_at)

## API Endpoints
- POST /quizzes — Create quiz (teacher only)
- GET /quizzes/:id — Get quiz with questions
- POST /quizzes/:id/start — Start attempt
- POST /attempts/:id/answer — Submit answer (returns updated score)
- GET /attempts/:id/results — Get detailed results
EOF

# ── Feature 003: Analytics (Phase 1 — spec only, very fresh) ──
cat > "$OUT/specs/003-analytics/spec.md" << 'EOF'
# Feature: Teacher Analytics Dashboard

## Requirements
- FR-011: Teachers see class-level quiz performance metrics
- FR-012: Dashboard shows per-student progress over time (line chart)
- FR-013: Teachers can filter analytics by date range, quiz, and student
- FR-014: Export analytics as CSV for grade book integration
- FR-015: Dashboard loads cached data when offline (last 7 days)

## User Stories
- US-007: As a teacher, I want to see which students are struggling
- US-008: As a teacher, I want to export quiz results to my grade book

## Success Criteria
- SC-007: Dashboard renders with cached data in < 1s offline
- SC-008: CSV export includes all attempt data with student names
EOF

# ── .specify/context.json ──
cat > "$OUT/.specify/context.json" << CTXEOF
{
  "version": "1.0.0",
  "brand": "MetodologIA",
  "product": "SDD",
  "created": "$NOW",
  "features": [
    {"id": "001-auth", "name": "User Authentication", "phase": "implement", "phaseNumber": 7},
    {"id": "002-quiz", "name": "Quiz Engine", "phase": "testify", "phaseNumber": 4},
    {"id": "003-analytics", "name": "Teacher Analytics", "phase": "specify", "phaseNumber": 1}
  ],
  "activeFeature": "001-auth"
}
CTXEOF

# ── .specify/health-history.json ──
cat > "$OUT/.specify/health-history.json" << 'EOF'
[
  {"timestamp":"2026-03-14T08:00:00Z","featureId":"001-auth","score":35,"factors":{"specCoverage":15,"testCoverage":5,"taskCompletion":5,"constitutionAlignment":10}},
  {"timestamp":"2026-03-15T09:00:00Z","featureId":"001-auth","score":42,"factors":{"specCoverage":18,"testCoverage":8,"taskCompletion":8,"constitutionAlignment":8}},
  {"timestamp":"2026-03-16T10:00:00Z","featureId":"001-auth","score":48,"factors":{"specCoverage":20,"testCoverage":10,"taskCompletion":10,"constitutionAlignment":8}},
  {"timestamp":"2026-03-17T08:30:00Z","featureId":"001-auth","score":55,"factors":{"specCoverage":22,"testCoverage":13,"taskCompletion":12,"constitutionAlignment":8}},
  {"timestamp":"2026-03-18T09:15:00Z","featureId":"001-auth","score":62,"factors":{"specCoverage":23,"testCoverage":15,"taskCompletion":14,"constitutionAlignment":10}},
  {"timestamp":"2026-03-19T10:00:00Z","featureId":"001-auth","score":68,"factors":{"specCoverage":24,"testCoverage":18,"taskCompletion":16,"constitutionAlignment":10}},
  {"timestamp":"2026-03-20T08:45:00Z","featureId":"001-auth","score":72,"factors":{"specCoverage":25,"testCoverage":20,"taskCompletion":17,"constitutionAlignment":10}},
  {"timestamp":"2026-03-21T09:30:00Z","featureId":"001-auth","score":75,"factors":{"specCoverage":25,"testCoverage":22,"taskCompletion":18,"constitutionAlignment":10}},
  {"timestamp":"2026-03-22T10:00:00Z","featureId":"001-auth","score":78,"factors":{"specCoverage":25,"testCoverage":23,"taskCompletion":20,"constitutionAlignment":10}},
  {"timestamp":"2026-03-23T08:00:00Z","featureId":"001-auth","score":82,"factors":{"specCoverage":25,"testCoverage":24,"taskCompletion":22,"constitutionAlignment":11}}
]
EOF

# ── .specify/sentinel-state.json ──
TWO_HOURS_AGO=$(date -u -v-2H +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -d "2 hours ago" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "$NOW")
cat > "$OUT/.specify/sentinel-state.json" << STEOF
{
  "enabled": true,
  "lastRun": "$TWO_HOURS_AGO",
  "runCount": 14,
  "intervalMinutes": 45,
  "suppressedUntil": null,
  "findings": [
    {"severity": "WARNING", "message": "002-quiz: checklist stale (>7 days)", "feature": "002-quiz"},
    {"severity": "MEDIUM", "message": "003-analytics: zero test coverage", "feature": "003-analytics"}
  ],
  "autoClosedCount": 3
}
STEOF

# ── .specify/phase-velocity.json ──
cat > "$OUT/.specify/phase-velocity.json" << 'EOF'
{
  "features": {
    "001-auth": {
      "constitution": {"started":"2026-03-14T08:00:00Z","completed":"2026-03-14T09:00:00Z"},
      "specify": {"started":"2026-03-14T09:00:00Z","completed":"2026-03-14T12:00:00Z"},
      "plan": {"started":"2026-03-15T08:00:00Z","completed":"2026-03-15T11:00:00Z"},
      "checklist": {"started":"2026-03-15T11:00:00Z","completed":"2026-03-15T12:00:00Z"},
      "testify": {"started":"2026-03-16T08:00:00Z","completed":"2026-03-16T14:00:00Z"},
      "tasks": {"started":"2026-03-17T08:00:00Z","completed":"2026-03-17T10:00:00Z"},
      "analyze": {"started":"2026-03-17T10:00:00Z","completed":"2026-03-17T12:00:00Z"},
      "implement": {"started":"2026-03-18T08:00:00Z","completed":null}
    },
    "002-quiz": {
      "constitution": {"started":"2026-03-14T08:00:00Z","completed":"2026-03-14T09:00:00Z"},
      "specify": {"started":"2026-03-19T08:00:00Z","completed":"2026-03-19T14:00:00Z"},
      "plan": {"started":"2026-03-20T08:00:00Z","completed":"2026-03-20T12:00:00Z"},
      "checklist": {"started":"2026-03-20T13:00:00Z","completed":"2026-03-20T14:00:00Z"},
      "testify": {"started":null,"completed":null}
    },
    "003-analytics": {
      "constitution": {"started":"2026-03-14T08:00:00Z","completed":"2026-03-14T09:00:00Z"},
      "specify": {"started":"2026-03-22T10:00:00Z","completed":null}
    }
  }
}
EOF

# ── .specify/session-log.json ──
cat > "$OUT/.specify/session-log.json" << 'EOF'
{"events":[
  {"timestamp":"2026-03-14T08:00:00Z","type":"init","description":"SDD project initialized","command":"/sdd:init"},
  {"timestamp":"2026-03-14T08:30:00Z","type":"constitution","description":"Constitution created with 5 principles","command":"/sdd:00-constitution"},
  {"timestamp":"2026-03-14T09:00:00Z","type":"specify","description":"Feature 001-auth specified (FR-001 to FR-005)","command":"/sdd:spec"},
  {"timestamp":"2026-03-15T08:00:00Z","type":"plan","description":"Technical plan for 001-auth created","command":"/sdd:plan"},
  {"timestamp":"2026-03-15T11:00:00Z","type":"checklist","description":"Quality checklist for 001-auth (7/8 passed)","command":"/sdd:check"},
  {"timestamp":"2026-03-16T08:00:00Z","type":"testify","description":"10 BDD scenarios for 001-auth generated","command":"/sdd:test"},
  {"timestamp":"2026-03-17T08:00:00Z","type":"tasks","description":"15 tasks for 001-auth (T-001 to T-015)","command":"/sdd:tasks"},
  {"timestamp":"2026-03-17T10:00:00Z","type":"analyze","description":"Cross-artifact analysis passed (98% score)","command":"/sdd:analyze"},
  {"timestamp":"2026-03-18T08:00:00Z","type":"implement","description":"Implementation started for 001-auth","command":"/sdd:impl"},
  {"timestamp":"2026-03-19T08:00:00Z","type":"specify","description":"Feature 002-quiz specified (FR-006 to FR-010)","command":"/sdd:spec"},
  {"timestamp":"2026-03-20T08:00:00Z","type":"plan","description":"Technical plan for 002-quiz created","command":"/sdd:plan"},
  {"timestamp":"2026-03-20T13:00:00Z","type":"checklist","description":"Quality checklist for 002-quiz created","command":"/sdd:check"},
  {"timestamp":"2026-03-20T14:00:00Z","type":"sentinel","description":"Sentinel: 2 findings (WARNING, MEDIUM)","command":"/sdd:sentinel"},
  {"timestamp":"2026-03-21T09:00:00Z","type":"dashboard","description":"Dashboard generated (10 views)","command":"/sdd:dashboard"},
  {"timestamp":"2026-03-22T10:00:00Z","type":"specify","description":"Feature 003-analytics specified (FR-011 to FR-015)","command":"/sdd:spec"},
  {"timestamp":"2026-03-22T11:00:00Z","type":"capture","description":"Captured brand-guide.html as RAG memory","command":"/sdd:capture"},
  {"timestamp":"2026-03-22T14:00:00Z","type":"sentinel","description":"Sentinel: health 82, 2 findings remain","command":"/sdd:sentinel"},
  {"timestamp":"2026-03-23T08:00:00Z","type":"insights","description":"Health trending up: 35→82 over 10 days","command":"/sdd:insights"},
  {"timestamp":"2026-03-23T09:00:00Z","type":"graph","description":"Knowledge graph: 45 nodes, 89 edges, 3 orphans","command":"/sdd:graph"},
  {"timestamp":"2026-03-23T10:00:00Z","type":"heartbeat","description":"Per-prompt heartbeat: 2 stale, health OK","command":"auto"}
]}
EOF

# ── RAG Memory example ──
cat > "$OUT/.specify/rag-memory/rag-memory-of-brand-guide.md" << 'EOF'
---
source: brand-guide.html
type: text/html
captured: 2026-03-22T11:00:00Z
tags: [brand, design-system, Neo-Swiss]
---

# RAG Memory: brand-guide.html

## Abstract
MetodologIA brand guide defining the Neo-Swiss Clean aesthetic for all digital products. Establishes color palette, typography hierarchy, and visual rules for the EdTech quiz platform.

## Key Takeaways
- Color palette: Navy #122562, Gold #FFD700, Blue #137DC5, Dark #1F2833
- Typography: Poppins (headings), Montserrat (body), JetBrains Mono (code)
- Aesthetic: Neo-Swiss Clean — flat vector, Swiss grid, generous whitespace
- Rule: NEVER use green for success states — use Blue #137DC5 instead
- Glassmorphism: blur(16px) saturate(180%) for card surfaces

## Relevant Insights
- The gold accent (#FFD700) is reserved for CTAs, focus states, and progress indicators
- Dark mode is the default — light mode is secondary
- Accessibility: minimum 4.5:1 contrast ratio for all text on dark backgrounds
- Brand voice: evidence-based, method-driven, no hype words

## Full Content
[HTML document with 12 sections covering: logo usage, color palette with hex values, typography scale, spacing system (8px grid), component library (cards, buttons, badges, tables), dark/light mode tokens, illustration style guide, iconography rules, and responsive breakpoints]
EOF

# ── .specify/rag-index.json ──
cat > "$OUT/.specify/rag-index.json" << 'EOF'
[
  {"file":"rag-memory-of-brand-guide.md","type":"text/html","captured":"2026-03-22T11:00:00Z","abstract":"MetodologIA brand guide defining Neo-Swiss Clean aesthetic","tags":["brand","design-system","Neo-Swiss"]}
]
EOF

# ── Summary ──
SPECS=$(find "$OUT/specs" -name "spec.md" | wc -l | tr -d ' ')
TASKS=$(grep -c '^\- \[' "$OUT/specs/001-auth/tasks.md" || echo 0)
TESTS=$(grep -c '@TS-' "$OUT/specs/001-auth/tests/features/auth.feature" || echo 0)

echo ""
echo -e "${GOLD}Demo project seeded successfully${RESET}"
echo -e "  ${BLUE}Location:${RESET}  $OUT"
echo -e "  ${BLUE}Features:${RESET}  $SPECS (auth: phase 7, quiz: phase 4, analytics: phase 1)"
echo -e "  ${BLUE}Tasks:${RESET}     $TASKS (10 done, 5 pending)"
echo -e "  ${BLUE}Tests:${RESET}     $TESTS BDD scenarios"
echo -e "  ${BLUE}Health:${RESET}    82/100 (trending up from 35)"
echo -e "  ${BLUE}Findings:${RESET}  2 (WARNING: quiz stale, MEDIUM: analytics no tests)"
echo -e "  ${BLUE}Orphans:${RESET}   FR-012 untested, P-V untraced, T-015 unlinked"
echo -e "  ${BLUE}RAG:${RESET}       1 memory file (brand-guide)"
echo ""
echo -e "${MUTED}Run: /sdd:dashboard to generate the full dashboard${RESET}"
echo -e "${MUTED}Run: /sdd:tour to start the onboarding experience${RESET}"
