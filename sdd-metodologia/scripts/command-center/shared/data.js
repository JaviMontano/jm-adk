/**
 * SDD Command Center — Demo Data Fixture
 * =======================================
 * Certification-grade data that exercises EVERY view of the SDD ALM dashboard.
 * Project: QuizMaster — Adaptive Quiz Platform for K-12 (EdTech)
 * 4 features at different pipeline phases for full coverage.
 *
 * Generated: 2026-03-23
 * Contract: IIKit dashboard + SDD extensions (workspace, insights, sentinel, knowledgeGraph, sessionLog)
 */

window.DASHBOARD_DATA = {

  // ── META ───────────────────────────────────────────────────────
  isDemo: true, // Flag: pages show "Demo Data" badge. Removed by generate-command-center-data.js
  generatedAt: "2026-03-23T18:00:00.000Z",

  // ── PROJECT ────────────────────────────────────────────────────
  project: { name: "quizmaster-edtech" },
  premise: { name: "QuizMaster \u2014 Adaptive Quiz Platform for K-12" },

  // ── FEATURES ───────────────────────────────────────────────────
  // 4 features at different phases to test all views:
  //   001: COMPLETE (all-green pipeline, "Done" column)
  //   002: Phase 7 Deliver (partial progress, "In Progress")
  //   003: Phase 4 Test (mid-pipeline, specs/quality exercise)
  //   004: Phase 1 User Specs (early stage, "Todo" column, empty states)
  features: [
    {
      id: "feat-001",
      name: "User Authentication",
      phase: "complete",
      status: "done",
      priority: "P0",
      progress: "23/23",
      stories: [
        { id: "US-001", title: "Student can register with email" },
        { id: "US-002", title: "Student can log in with Google SSO" },
        { id: "US-003", title: "Teacher can reset password" },
        { id: "US-004", title: "Admin can deactivate accounts" },
        { id: "US-005", title: "Session persists across page reload" }
      ],
      requirements: [
        { id: "FR-001", title: "Email/password registration with validation", status: "verified" },
        { id: "FR-002", title: "Google OAuth 2.0 integration", status: "verified" },
        { id: "FR-003", title: "Password reset via email link", status: "verified" },
        { id: "FR-004", title: "Account deactivation by admin role", status: "verified" },
        { id: "FR-005", title: "JWT token refresh with 15-min expiry", status: "verified" },
        { id: "FR-006", title: "RBAC: student, teacher, admin roles", status: "verified" },
        { id: "FR-007", title: "Rate limiting on auth endpoints (5/min)", status: "verified" },
        { id: "FR-008", title: "Audit log for auth events", status: "verified" }
      ],
      successCriteria: [
        "All 5 user stories accepted by product owner",
        "100% of auth endpoints covered by integration tests",
        "Zero critical vulnerabilities in OWASP auth checklist",
        "SSO login completes in under 3 seconds",
        "Password reset email delivered within 60 seconds"
      ],
      tests: [
        { id: "TS-001", title: "Register with valid email", status: "passed" },
        { id: "TS-002", title: "Register with duplicate email fails", status: "passed" },
        { id: "TS-003", title: "Login with correct credentials", status: "passed" },
        { id: "TS-004", title: "Login with wrong password fails", status: "passed" },
        { id: "TS-005", title: "Google SSO redirect and callback", status: "passed" },
        { id: "TS-006", title: "Password reset token generation", status: "passed" },
        { id: "TS-007", title: "Password reset with expired token fails", status: "passed" },
        { id: "TS-008", title: "Admin deactivates student account", status: "passed" },
        { id: "TS-009", title: "Deactivated user cannot login", status: "passed" },
        { id: "TS-010", title: "JWT refresh within window", status: "passed" },
        { id: "TS-011", title: "JWT refresh after expiry rejected", status: "passed" },
        { id: "TS-012", title: "Rate limit triggers after 5 attempts", status: "passed" }
      ],
      taskItems: [
        { id: "T-001", title: "Set up auth module scaffold", frRef: "FR-001", status: "done" },
        { id: "T-002", title: "Implement email registration endpoint", frRef: "FR-001", status: "done" },
        { id: "T-003", title: "Add input validation (email, password strength)", frRef: "FR-001", status: "done" },
        { id: "T-004", title: "Integrate Google OAuth2 provider", frRef: "FR-002", status: "done" },
        { id: "T-005", title: "Handle OAuth callback and token exchange", frRef: "FR-002", status: "done" },
        { id: "T-006", title: "Build password reset email template", frRef: "FR-003", status: "done" },
        { id: "T-007", title: "Implement reset token generation + expiry", frRef: "FR-003", status: "done" },
        { id: "T-008", title: "Add admin account deactivation endpoint", frRef: "FR-004", status: "done" },
        { id: "T-009", title: "Implement JWT refresh middleware", frRef: "FR-005", status: "done" },
        { id: "T-010", title: "Create RBAC permission matrix", frRef: "FR-006", status: "done" },
        { id: "T-011", title: "Add rate limiter to auth routes", frRef: "FR-007", status: "done" },
        { id: "T-012", title: "Implement auth event audit logger", frRef: "FR-008", status: "done" }
      ]
    },
    {
      id: "feat-002",
      name: "Quiz Engine",
      phase: "deliver",
      status: "in-progress",
      priority: "P0",
      progress: "19/31",
      stories: [
        { id: "US-006", title: "Teacher can create a quiz with multiple question types" },
        { id: "US-007", title: "Student can take a timed quiz" },
        { id: "US-008", title: "System auto-grades objective questions" },
        { id: "US-009", title: "Student sees results immediately after submission" }
      ],
      requirements: [
        { id: "FR-009", title: "Support MCQ, true/false, fill-in-blank question types", status: "verified" },
        { id: "FR-010", title: "Quiz timer with configurable duration", status: "verified" },
        { id: "FR-011", title: "Auto-save answers every 30 seconds", status: "verified" },
        { id: "FR-012", title: "Auto-grading engine for objective questions", status: "verified" },
        { id: "FR-013", title: "Real-time score calculation on submit", status: "in-progress" },
        { id: "FR-014", title: "Quiz attempt history per student", status: "verified" },
        { id: "FR-015", title: "Timer pause on tab switch (accessibility)", status: "blocked" }
      ],
      successCriteria: [
        "Quiz creation wizard tested with 3+ question types",
        "Auto-grading accuracy at 100% for objective questions",
        "Timer pause verified across Chrome, Firefox, Safari",
        "Results page renders within 2 seconds of submission"
      ],
      tests: [
        { id: "TS-013", title: "Create MCQ quiz with 10 questions", status: "passed" },
        { id: "TS-014", title: "Create true/false quiz", status: "passed" },
        { id: "TS-015", title: "Create fill-in-blank quiz", status: "passed" },
        { id: "TS-016", title: "Timer starts on quiz begin", status: "passed" },
        { id: "TS-017", title: "Timer expires and auto-submits", status: "passed" },
        { id: "TS-018", title: "Auto-save triggers at 30s interval", status: "passed" },
        { id: "TS-019", title: "Auto-grade MCQ correctly", status: "passed" },
        { id: "TS-020", title: "Auto-grade true/false correctly", status: "passed" },
        { id: "TS-021", title: "Score displayed after submission", status: "passed" },
        { id: "TS-022", title: "Quiz attempt saved to history", status: "passed" },
        { id: "TS-023", title: "Timer pauses on tab switch", status: "failed" },
        { id: "TS-024", title: "Timer resumes on tab return", status: "failed" },
        { id: "TS-025", title: "Real-time score with partial answers", status: "pending" },
        { id: "TS-026", title: "Concurrent quiz sessions handled", status: "pending" },
        { id: "TS-027", title: "Quiz results export to CSV", status: "pending" }
      ],
      taskItems: [
        { id: "T-013", title: "Design quiz data model (questions, options, answers)", frRef: "FR-009", status: "done" },
        { id: "T-014", title: "Build MCQ/TF/FIB question type renderers", frRef: "FR-009", status: "done" },
        { id: "T-015", title: "Implement configurable timer component", frRef: "FR-010", status: "done" },
        { id: "T-016", title: "Add auto-save interval (30s debounced)", frRef: "FR-011", status: "done" },
        { id: "T-017", title: "Build auto-grading engine", frRef: "FR-012", status: "done" },
        { id: "T-018", title: "Implement real-time score aggregation", frRef: "FR-013", status: "wip" },
        { id: "T-019", title: "Create quiz history storage + query", frRef: "FR-014", status: "done" },
        { id: "T-020", title: "Add Page Visibility API for timer pause", frRef: "FR-015", status: "blocked" }
      ],
      bugs: [
        {
          id: "BUG-001",
          title: "Timer doesn't pause on tab switch",
          severity: "medium",
          status: "open",
          feature: "feat-002",
          requirement: "FR-015",
          description: "The Page Visibility API listener is registered but the timer countdown continues when the tab is hidden. Affects timed quizzes on all browsers.",
          stepsToReproduce: "1. Start a timed quiz. 2. Switch to another tab. 3. Return after 30s. 4. Timer has advanced instead of pausing.",
          assignee: "unassigned"
        }
      ]
    },
    {
      id: "feat-003",
      name: "Adaptive Difficulty",
      phase: "test",
      status: "in-progress",
      priority: "P1",
      progress: "12/35",
      stories: [
        { id: "US-010", title: "System adjusts question difficulty based on student performance" },
        { id: "US-011", title: "Teacher can set difficulty bounds per quiz" },
        { id: "US-012", title: "Student sees difficulty level indicator during quiz" }
      ],
      requirements: [
        { id: "FR-016", title: "IRT-based difficulty scoring (Item Response Theory)", status: "verified" },
        { id: "FR-017", title: "Real-time difficulty adjustment after each answer", status: "verified" },
        { id: "FR-018", title: "Teacher-configurable difficulty ceiling and floor", status: "in-progress" },
        { id: "FR-019", title: "Difficulty progression analytics per student", status: "untested", orphan: true },
        { id: "FR-020", title: "Visual difficulty indicator (1-5 stars)", status: "in-progress" }
      ],
      successCriteria: [
        "IRT algorithm calibrated against 500-question test bank",
        "Difficulty adjusts within 2 questions of performance shift",
        "Analytics dashboard shows per-student difficulty curves"
      ],
      tests: [
        { id: "TS-028", title: "IRT score calculated after first answer", status: "passed" },
        { id: "TS-029", title: "Difficulty increases after 3 correct answers", status: "passed" },
        { id: "TS-030", title: "Difficulty decreases after 2 incorrect answers", status: "passed" },
        { id: "TS-031", title: "Difficulty respects teacher-set ceiling", status: "pending" },
        { id: "TS-032", title: "Difficulty respects teacher-set floor", status: "pending" },
        { id: "TS-033", title: "Star indicator updates in real-time", status: "passed" },
        { id: "TS-034", title: "Analytics endpoint returns difficulty curve", status: "pending" },
        { id: "TS-035", title: "Edge case: all answers correct stays at max", status: "pending" }
      ],
      taskItems: [
        { id: "T-021", title: "Implement IRT scoring algorithm", frRef: "FR-016", status: "done" },
        { id: "T-022", title: "Build real-time difficulty adjuster", frRef: "FR-017", status: "done" },
        { id: "T-023", title: "Add teacher difficulty config UI", frRef: "FR-018", status: "wip" },
        { id: "T-024", title: "Create difficulty analytics endpoint", frRef: "FR-019", status: "todo" },
        { id: "T-025", title: "Build star difficulty indicator", frRef: "FR-020", status: "wip" }
      ]
    },
    {
      id: "feat-004",
      name: "Analytics Dashboard",
      phase: "spec",
      status: "todo",
      priority: "P2",
      progress: "0/0",
      stories: [
        { id: "US-013", title: "Teacher views class-wide quiz performance" },
        { id: "US-014", title: "Admin views school-level aggregated stats" }
      ],
      requirements: [
        { id: "FR-021", title: "Class performance heatmap by topic", status: "draft" },
        { id: "FR-022", title: "Individual student progress timeline", status: "draft" },
        { id: "FR-023", title: "Exportable PDF reports for parent-teacher meetings", status: "draft" }
      ],
      successCriteria: [
        "Heatmap renders for classes up to 40 students",
        "PDF report generates in under 5 seconds"
      ],
      tests: []
    }
  ],

  // ── CONSTITUTION ───────────────────────────────────────────────
  constitution: {
    principles: [
      {
        number: "P-I",
        name: "Skills-First Architecture",
        text: "Every pipeline phase is a self-contained skill with explicit inputs, outputs, and prerequisites. No implicit dependencies.",
        rationale: "Enables multi-agent orchestration and cross-platform portability.",
        level: "MUST"
      },
      {
        number: "P-II",
        name: "Phase Separation",
        text: "Specification, testing, and implementation are strictly sequential phases. No phase may execute before its predecessor completes.",
        rationale: "Prevents intent drift and ensures each artifact builds on verified foundations.",
        level: "MUST"
      },
      {
        number: "P-III",
        name: "Self-Validating Artifacts",
        text: "Every specification artifact must include verifiable acceptance criteria. BDD scenarios carry cryptographic assertion hashes.",
        rationale: "Provides tamper-evident traceability from intent to implementation.",
        level: "MUST"
      },
      {
        number: "P-IV",
        name: "Cross-Platform Compatibility",
        text: "Skills must be agent-agnostic: compatible with Claude Code, Codex, Gemini, and OpenCode without modification.",
        rationale: "Avoids vendor lock-in and maximizes team flexibility.",
        level: "SHOULD"
      },
      {
        number: "P-V",
        name: "Multi-Agent Collaboration",
        text: "The system supports multiple concurrent agents working on different features or phases without conflict.",
        rationale: "Scales development capacity linearly with available agents.",
        level: "SHOULD"
      }
    ]
  },

  // ── GOVERNANCE ─────────────────────────────────────────────────
  governance: {
    principles: { length: 5 },
    operationalLogs: {
      tasklog: { exists: true, entries: 12 },
      changelog: { exists: true, entries: 8 },
      decisionLog: { exists: true, entries: 3 }
    }
  },

  // ── QUALITY ────────────────────────────────────────────────────
  quality: {
    passRate: 78,
    totalTests: 47,
    totalFR: 23,
    coverageByFeature: {
      "feat-001": { total: 12, passed: 12, failed: 0, pending: 0 },
      "feat-002": { total: 15, passed: 10, failed: 2, pending: 3 },
      "feat-003": { total: 8,  passed: 3,  failed: 0, pending: 5 },
      "feat-004": { total: 0,  passed: 0,  failed: 0, pending: 0 }
    }
  },

  // ── INSIGHTS ───────────────────────────────────────────────────
  insights: {
    healthScore: 78,
    testPassRate: 78,
    traceability: {
      principlesCovered: 5,
      requirementsTotal: 23,
      requirementsTested: 16,
      requirementsOrphan: 1,
      tasksTotal: 89,
      tasksCompleted: 54
    }
  },

  // ── SCORE HISTORY (top-level — read by intelligence.html) ─────
  scoreHistory: [
    { date: "2026-03-10", score: 45 },
    { date: "2026-03-11", score: 48 },
    { date: "2026-03-12", score: 52 },
    { date: "2026-03-14", score: 58 },
    { date: "2026-03-16", score: 63 },
    { date: "2026-03-17", score: 67 },
    { date: "2026-03-18", score: 71 },
    { date: "2026-03-19", score: 62 },
    { date: "2026-03-21", score: 74 },
    { date: "2026-03-23", score: 78 }
  ],

  // ── WORKSPACE ──────────────────────────────────────────────────
  workspace: {
    fileCount: 87,
    files: [
      // ── specs/001-user-auth/ ──
      { path: "specs/001-user-auth/spec.md", size: "4.2 KB", modified: "2026-03-15" },
      { path: "specs/001-user-auth/plan.md", size: "6.8 KB", modified: "2026-03-16" },
      { path: "specs/001-user-auth/tasks.md", size: "3.1 KB", modified: "2026-03-17" },
      { path: "specs/001-user-auth/analysis.md", size: "2.4 KB", modified: "2026-03-18" },
      { path: "specs/001-user-auth/checklists/quality-checklist.md", size: "1.8 KB", modified: "2026-03-16" },
      { path: "specs/001-user-auth/checklists/security-checklist.md", size: "1.2 KB", modified: "2026-03-16" },
      { path: "specs/001-user-auth/tests/features/registration.feature", size: "2.1 KB", modified: "2026-03-17" },
      { path: "specs/001-user-auth/tests/features/login.feature", size: "1.9 KB", modified: "2026-03-17" },
      { path: "specs/001-user-auth/tests/features/password-reset.feature", size: "1.4 KB", modified: "2026-03-17" },
      { path: "specs/001-user-auth/tests/features/admin-deactivate.feature", size: "1.1 KB", modified: "2026-03-17" },
      { path: "specs/001-user-auth/tests/features/jwt-refresh.feature", size: "0.9 KB", modified: "2026-03-17" },
      { path: "specs/001-user-auth/tests/features/rate-limit.feature", size: "0.8 KB", modified: "2026-03-17" },

      // ── specs/002-quiz-engine/ ──
      { path: "specs/002-quiz-engine/spec.md", size: "5.6 KB", modified: "2026-03-18" },
      { path: "specs/002-quiz-engine/plan.md", size: "7.2 KB", modified: "2026-03-19" },
      { path: "specs/002-quiz-engine/tasks.md", size: "4.5 KB", modified: "2026-03-20" },
      { path: "specs/002-quiz-engine/checklists/quality-checklist.md", size: "2.0 KB", modified: "2026-03-19" },
      { path: "specs/002-quiz-engine/tests/features/quiz-creation.feature", size: "2.8 KB", modified: "2026-03-20" },
      { path: "specs/002-quiz-engine/tests/features/quiz-timer.feature", size: "1.6 KB", modified: "2026-03-20" },
      { path: "specs/002-quiz-engine/tests/features/auto-grading.feature", size: "2.2 KB", modified: "2026-03-20" },
      { path: "specs/002-quiz-engine/tests/features/quiz-results.feature", size: "1.3 KB", modified: "2026-03-20" },
      { path: "specs/002-quiz-engine/tests/features/quiz-history.feature", size: "1.1 KB", modified: "2026-03-20" },
      { path: "specs/002-quiz-engine/bugs.md", size: "1.8 KB", modified: "2026-03-22" },

      // ── specs/003-adaptive-difficulty/ ──
      { path: "specs/003-adaptive-difficulty/spec.md", size: "3.9 KB", modified: "2026-03-20" },
      { path: "specs/003-adaptive-difficulty/plan.md", size: "5.1 KB", modified: "2026-03-21" },
      { path: "specs/003-adaptive-difficulty/checklists/quality-checklist.md", size: "1.5 KB", modified: "2026-03-21" },
      { path: "specs/003-adaptive-difficulty/tests/features/irt-scoring.feature", size: "1.8 KB", modified: "2026-03-22" },
      { path: "specs/003-adaptive-difficulty/tests/features/difficulty-adjust.feature", size: "1.4 KB", modified: "2026-03-22" },

      // ── specs/004-analytics-dashboard/ ──
      { path: "specs/004-analytics-dashboard/spec.md", size: "2.7 KB", modified: "2026-03-22" },

      // ── .specify/ ──
      { path: ".specify/context.json", size: "1.4 KB", modified: "2026-03-23" },
      { path: ".specify/sentinel-state.json", size: "0.8 KB", modified: "2026-03-23" },
      { path: ".specify/health-history.json", size: "1.2 KB", modified: "2026-03-23" },
      { path: ".specify/knowledge-graph.json", size: "3.6 KB", modified: "2026-03-23" },
      { path: ".specify/session-log.json", size: "2.1 KB", modified: "2026-03-23" },
      { path: ".specify/rag-index.json", size: "0.9 KB", modified: "2026-03-22" },
      { path: ".specify/shared/data.js", size: "18.4 KB", modified: "2026-03-23" },
      { path: ".specify/shared/nav.js", size: "8.5 KB", modified: "2026-03-23" },
      { path: ".specify/shared/tokens.css", size: "6.0 KB", modified: "2026-03-23" },
      { path: ".specify/shared/footer.js", size: "0.4 KB", modified: "2026-03-23" },
      { path: ".specify/dashboard.html", size: "12.8 KB", modified: "2026-03-23" },
      { path: ".specify/index.html", size: "14.6 KB", modified: "2026-03-23" },
      { path: ".specify/pipeline.html", size: "17.9 KB", modified: "2026-03-23" },
      { path: ".specify/specs.html", size: "12.8 KB", modified: "2026-03-23" },
      { path: ".specify/quality.html", size: "17.4 KB", modified: "2026-03-23" },
      { path: ".specify/intelligence.html", size: "17.9 KB", modified: "2026-03-23" },
      { path: ".specify/workspace.html", size: "15.5 KB", modified: "2026-03-23" },
      { path: ".specify/governance.html", size: "21.9 KB", modified: "2026-03-23" },

      // ── workspace/ ──
      { path: "workspace/2026-03-20-initial-requirements/inputs/stakeholder-notes.md", size: "3.2 KB", modified: "2026-03-20" },
      { path: "workspace/2026-03-20-initial-requirements/inputs/competitor-analysis.html", size: "8.7 KB", modified: "2026-03-20" },
      { path: "workspace/2026-03-20-initial-requirements/inputs/user-research-summary.md", size: "2.5 KB", modified: "2026-03-20" },

      // ── Root files ──
      { path: "CONSTITUTION.md", size: "3.4 KB", modified: "2026-03-15" },
      { path: "PREMISE.md", size: "1.8 KB", modified: "2026-03-14" },
      { path: "tasklog.md", size: "4.6 KB", modified: "2026-03-23" },
      { path: "changelog.md", size: "3.2 KB", modified: "2026-03-23" },
      { path: "decision-log.md", size: "1.9 KB", modified: "2026-03-21" },

      // ── RAG Memory files (detected by workspace.html via "rag-memory-of-" prefix) ──
      {
        path: "workspace/rag-memory-of-product-requirements.md",
        name: "rag-memory-of-product-requirements.md",
        size: "5.1 KB",
        modified: "2026-03-20",
        type: "text",
        abstract: "Vision document for the QuizMaster adaptive quiz platform. Covers K-12 market positioning, core value propositions (adaptive difficulty, real-time grading, teacher analytics), and year-one feature roadmap with 4 major releases.",
        tags: ["product", "vision", "roadmap", "edtech"]
      },
      {
        path: "workspace/rag-memory-of-competitor-analysis.html",
        name: "rag-memory-of-competitor-analysis.html",
        size: "8.7 KB",
        modified: "2026-03-20",
        type: "html",
        abstract: "Competitive landscape analysis comparing QuizMaster against Kahoot, Quizlet, and Google Forms. Highlights differentiation through IRT-based adaptive difficulty engine and real-time teacher dashboards. Identifies gaps in accessibility and offline mode.",
        tags: ["competitive", "kahoot", "quizlet", "market"]
      },
      {
        path: "workspace/rag-memory-of-stakeholder-interview.md",
        name: "rag-memory-of-stakeholder-interview.md",
        size: "6.3 KB",
        modified: "2026-03-21",
        type: "audio-transcription",
        abstract: "Transcription of 45-minute interview with PM Sarah Chen. Key insights: teachers prioritize ease of quiz creation over advanced features, students need immediate feedback, district admins require PDF reports for parent-teacher conferences. Accessibility (WCAG 2.1 AA) is a hard requirement.",
        tags: ["interview", "stakeholder", "pm", "accessibility"]
      }
    ]
  },

  // ── KNOWLEDGE GRAPH ────────────────────────────────────────────
  knowledgeGraph: {
    nodes: 156,
    edges: 234,
    orphans: 7,
    breakdown: {
      principles: 5,
      requirements: 23,
      tests: 35,
      tasks: 89,
      bugs: 1
    }
  },

  // ── SENTINEL ───────────────────────────────────────────────────
  sentinel: {
    enabled: true,
    lastRun: "2026-03-23T17:45:00Z",
    runCount: 42,
    intervalMinutes: 30,
    suppressedUntil: null,
    findings: [
      {
        id: "SENT-041",
        type: "stale",
        severity: "WARNING",
        message: "specs/003-adaptive-difficulty/plan.md is 2 days older than its spec.md \u2014 plan may be outdated",
        artifact: "specs/003-adaptive-difficulty/plan.md",
        detectedAt: "2026-03-23T17:45:00Z",
        recommendation: "Re-run /sdd:plan for feature 003 to synchronize"
      },
      {
        id: "SENT-042",
        type: "info",
        severity: "INFO",
        message: "Feature 001 (User Authentication) fully verified \u2014 all 12 tests passing, 8/8 requirements covered",
        artifact: "specs/001-user-auth/",
        detectedAt: "2026-03-23T17:45:00Z",
        recommendation: "No action needed \u2014 feature is healthy"
      }
    ]
  },

  // ── SESSION LOG ────────────────────────────────────────────────
  sessionLog: [
    {
      timestamp: "2026-03-23T14:00:12Z",
      type: "init",
      description: "Session started \u2014 QuizMaster project loaded with 4 features"
    },
    {
      timestamp: "2026-03-23T14:05:33Z",
      type: "command",
      description: "/sdd:spec executed for Feature 004 (Analytics Dashboard)"
    },
    {
      timestamp: "2026-03-23T14:22:18Z",
      type: "file_modified",
      description: "specs/004-analytics-dashboard/spec.md created (2.7 KB)"
    },
    {
      timestamp: "2026-03-23T15:10:45Z",
      type: "command",
      description: "/sdd:test executed for Feature 003 (Adaptive Difficulty)"
    },
    {
      timestamp: "2026-03-23T16:30:02Z",
      type: "capture",
      description: "RAG memory captured: stakeholder-interview.md (audio-transcription, 6.3 KB)"
    },
    {
      timestamp: "2026-03-23T17:00:11Z",
      type: "command",
      description: "/sdd:dashboard generated \u2014 7 HTML views + shared assets"
    },
    {
      timestamp: "2026-03-23T17:45:00Z",
      type: "sentinel",
      description: "Sentinel cycle #42 complete \u2014 1 WARNING (stale plan.md), 1 INFO (feat-001 healthy)"
    },
    {
      timestamp: "2026-03-23T17:58:30Z",
      type: "file_modified",
      description: "tasklog.md updated with 3 new entries from today's session"
    }
  ],

  // ── SMART NAV ──────────────────────────────────────────────────
  smartNav: {
    message: "2 feature(s) in progress \u2014 Feature 003 needs BDD scenarios",
    command: "/sdd:test",
    action: "Generate test scenarios"
  },

  // ── SUMMARY ────────────────────────────────────────────────────
  summary: {
    totalFeatures: 4,
    completeFeatures: 1,
    totalTasks: 89,
    completedTasks: 54,
    inProgressFeatures: 2,
    todoFeatures: 1,
    overallProgress: "61%"
  },

  // ── BACKLOG (features not yet in pipeline) ────────────────
  backlog: [
    { id: "feat-005", name: "Quiz Analytics Dashboard", priority: "P1", status: "backlog", effort: "L", description: "Real-time analytics for quiz completion rates, score distributions, and learning gaps", frCount: 0, tsCount: 0, taskCount: 0, requestedBy: "Product Owner", createdAt: "2026-03-20" },
    { id: "feat-006", name: "Parent Progress Reports", priority: "P2", status: "backlog", effort: "M", description: "Weekly email digest for parents showing child quiz performance and improvement areas", frCount: 0, tsCount: 0, taskCount: 0, requestedBy: "Stakeholder Interview", createdAt: "2026-03-21" },
    { id: "feat-007", name: "Offline Quiz Mode", priority: "P1", status: "backlog", effort: "XL", description: "Service worker + IndexedDB for quiz taking without internet — sync on reconnect", frCount: 0, tsCount: 0, taskCount: 0, requestedBy: "User Research", createdAt: "2026-03-22" },
    { id: "feat-008", name: "Teacher Dashboard", priority: "P0", status: "backlog", effort: "L", description: "Classroom management view — assign quizzes, view class progress, export grades", frCount: 0, tsCount: 0, taskCount: 0, requestedBy: "Pilot School Feedback", createdAt: "2026-03-23" }
  ],

  // ── CHANGELOG (operational log) ───────────────────────────
  changelog: [
    { date: "2026-03-23", type: "completion", description: "Feature 001 (User Auth) — all 8 FR verified, 12 BDD passing, deployed to staging", principles: ["IX", "VII"], artifact: "specs/001-user-auth/" },
    { date: "2026-03-23", type: "decision", description: "Adopted bcrypt over Argon2 for password hashing — Node.js native support, no C++ binding", principles: ["XIV", "XII"], artifact: "ADR-003" },
    { date: "2026-03-22", type: "amendment", description: "Constitution v1.1 — added Principle VI (Offline Resilience) based on user research findings", principles: ["XVII"], artifact: "CONSTITUTION.md" },
    { date: "2026-03-22", type: "insight", description: "Socratic debate resolved: quiz timer uses server-authoritative timestamps, not client clock", principles: ["VII", "XV"], artifact: "insights/security.md" },
    { date: "2026-03-21", type: "completion", description: "Feature 002 (Quiz Engine) — 14/18 tasks done, 4 remaining for adaptive difficulty integration", principles: ["IX"], artifact: "specs/002-quiz-engine/" },
    { date: "2026-03-21", type: "blocker", description: "Firebase emulator port conflict with existing project — resolved by switching to port 8081", principles: ["XVI"], artifact: "tasklog.md" },
    { date: "2026-03-20", type: "discovery", description: "Content extraction pipeline identified 47 quiz templates in legacy system — migration path defined", principles: ["VI"], artifact: "workspace/rag-memory-of-legacy-quiz-templates.md" },
    { date: "2026-03-19", type: "decision", description: "Chose Vitest over Jest for unit testing — 3x faster cold start, native ESM, compat with existing stack", principles: ["XIV", "IX"], artifact: "ADR-001" }
  ],

  // ── TASKLOG (open work items) ─────────────────────────────
  tasklog: [
    { id: "TL-014", task: "Implement adaptive difficulty algorithm for Feature 003", status: "in-progress", owner: "Agent", opened: "2026-03-22", age: 1, notes: "K-means clustering on quiz response patterns" },
    { id: "TL-015", task: "Write E2E tests for quiz submission flow", status: "open", owner: "Agent", opened: "2026-03-23", age: 0, notes: "Playwright — covers timeout, retry, offline scenarios" },
    { id: "TL-016", task: "Resolve quiz timer server-authoritative migration", status: "blocked", owner: "Agent", opened: "2026-03-22", age: 1, notes: "Blocked by ADR-004 decision on WebSocket vs polling" },
    { id: "TL-017", task: "Seed Firestore with 47 legacy quiz templates", status: "open", owner: "Agent", opened: "2026-03-21", age: 2, notes: "Depends on extraction pipeline (Feature 003)" },
    { id: "TL-018", task: "Update CONSTITUTION.md with offline resilience principle", status: "completed", owner: "Human", opened: "2026-03-20", age: 3, notes: "Done — Principle VI added in v1.1" },
    { id: "TL-019", task: "Review Feature 004 spec for completeness before plan phase", status: "deferred", owner: "Human", opened: "2026-03-23", age: 0, notes: "Deferred until Feature 003 reaches implementation" }
  ],

  // ── DECISION LOG (ADRs) ───────────────────────────────────
  decisionLog: [
    { id: "ADR-001", title: "Use Vitest over Jest for unit testing", status: "accepted", date: "2026-03-19", context: "Need fast test runner for TDD workflow with ESM support", options: ["Jest (mature, large ecosystem)", "Vitest (fast, native ESM, Vite compat)", "uvu (minimal, fast but limited)"], decision: "Vitest — 3x faster cold start, native ESM, compatible with existing Vite toolchain", consequences: "All test files use .test.js extension, import from vitest. Jest plugins not available.", anchor: "Principle XIV (Simple First), Principle IX (TDD)" },
    { id: "ADR-002", title: "Firebase Auth over custom JWT", status: "accepted", date: "2026-03-19", context: "Need authentication for quiz platform — teachers, students, parents", options: ["Custom JWT with bcrypt", "Firebase Auth (managed)", "Auth0 (third-party SaaS)"], decision: "Firebase Auth — zero server management, built-in providers, integrates with Firestore rules", consequences: "Vendor lock-in to Firebase ecosystem. Mitigated by abstraction layer in auth-service.js.", anchor: "Principle I (Client-Rendered, Cloud-Backed), Principle VII (Secure by Default)" },
    { id: "ADR-003", title: "bcrypt over Argon2 for password hashing", status: "accepted", date: "2026-03-23", context: "Firebase Auth handles most auth but custom admin tokens need hashing", options: ["Argon2 (memory-hard, best security)", "bcrypt (battle-tested, native Node.js)", "scrypt (Node.js built-in)"], decision: "bcrypt — native Node.js support via bcryptjs, no C++ binding needed, proven security", consequences: "Slightly less memory-hard than Argon2. Acceptable for admin-only use case.", anchor: "Principle XIV (Simple First)" },
    { id: "ADR-004", title: "Quiz timer: server-authoritative vs client", status: "proposed", date: "2026-03-22", context: "Quiz timers must be tamper-proof — students shouldn't manipulate remaining time", options: ["Client-side timer with server validation", "Server-authoritative via WebSocket", "Server-authoritative via polling (30s)"], decision: "Pending Socratic debate resolution", consequences: "TBD", anchor: "Principle VII (Secure by Default), Principle XV (BDD)" },
    { id: "ADR-005", title: "Offline quiz sync strategy", status: "proposed", date: "2026-03-23", context: "Students in rural areas may lose connectivity mid-quiz", options: ["Service Worker + IndexedDB (full offline)", "LocalStorage cache (simple, limited)", "No offline (require connectivity)"], decision: "Pending — depends on Feature 007 scope finalization", consequences: "TBD", anchor: "Principle VIII (Offline Resilience)" }
  ],

  // ── QA PLAN (unified quality governance) ──────────────────
  qaplan: {
    version: "1.0",
    generatedAt: "2026-03-23T18:00:00Z",
    constitutionVersion: "1.1",

    // Global Definition of Done — one row per pipeline phase
    dod: [
      { phase: "P0", name: "Constitution", criterion: "Principles defined, evidence tags enforced", target: "\u22655 principles, 100% tagged", status: "passed" },
      { phase: "P1", name: "User Specs", criterion: "FR/SC complete, <30% assumptions", target: "FR\u22653, SC\u22651 per FR", status: "passed" },
      { phase: "P2", name: "Technical Specs", criterion: "Data model, API contracts, Gate G1", target: "Spec + Plan exist", status: "passed" },
      { phase: "P3", name: "BDD Analysis", criterion: "Checklist 100% checked", target: "All items [x]", status: "passed" },
      { phase: "P4", name: "Test", criterion: "Gherkin hash-locked, \u22651 TS per FR", target: "Coverage \u2265 80%", status: "in-progress" },
      { phase: "P5", name: "Task", criterion: "All tasks ordered, parallel marked", target: "Tasks \u2265 FR count", status: "in-progress" },
      { phase: "P6", name: "Organize", criterion: "Analysis score \u2265 95%, Gate G2", target: "Zero HIGH", status: "pending" },
      { phase: "P7", name: "Deliver", criterion: "Tests green, code reviewed, Gate G3", target: "100% pass", status: "pending" },
      { phase: "P8", name: "Ship", criterion: "Deployed, changelog updated", target: "Issues exported", status: "pending" }
    ],

    // Global Acceptance Criteria — project-wide quality contracts
    globalAC: [
      { id: "AC-001", description: "Every FR-XXX has \u22651 TS-XXX scenario", checked: true },
      { id: "AC-002", description: "Every SC-XXX has \u22651 verification scenario", checked: true },
      { id: "AC-003", description: "Zero CRITICAL findings in analysis", checked: true },
      { id: "AC-004", description: "Assertion hash integrity verified", checked: true },
      { id: "AC-005", description: "Brand compliance (zero green, design tokens)", checked: true },
      { id: "AC-006", description: "Constitution alignment \u226595%", checked: false },
      { id: "AC-007", description: "All features have qa/acceptance-criteria.md", checked: false },
      { id: "AC-008", description: "Test coverage \u226580% for all in-progress features", checked: false }
    ],

    // Quality Gate Registry
    gates: [
      { id: "G1", phase: "P2", name: "Technical Specs", status: "passed", passedAt: "2026-03-20T10:00:00Z", blocker: null },
      { id: "G2", phase: "P6", name: "Organize Plan", status: "pending", passedAt: null, blocker: "feat-003 analysis incomplete" },
      { id: "G3", phase: "P7", name: "Deliver", status: "pending", passedAt: null, blocker: null }
    ],

    // Per-feature quality summary
    featureQuality: [
      { feature: "001-user-auth", acCoverage: "8/8", acPct: 100, testCoverage: "12/12", testPct: 100, checklistPct: 100, health: 95, phase: "complete" },
      { feature: "002-quiz-engine", acCoverage: "5/7", acPct: 71, testCoverage: "10/15", testPct: 67, checklistPct: 85, health: 72, phase: "deliver" },
      { feature: "003-adaptive-difficulty", acCoverage: "3/5", acPct: 60, testCoverage: "5/8", testPct: 63, checklistPct: 70, health: 58, phase: "test" },
      { feature: "004-analytics-dashboard", acCoverage: "0/3", acPct: 0, testCoverage: "0/0", testPct: 0, checklistPct: 0, health: 15, phase: "spec" }
    ],

    // Sub-QA artifact index
    subArtifacts: [
      { feature: "001-user-auth", artifact: "Acceptance Criteria", path: "specs/001-user-auth/qa/acceptance-criteria.md", status: "verified" },
      { feature: "001-user-auth", artifact: "Quality Checklist", path: "specs/001-user-auth/qa/quality-checklist.md", status: "complete" },
      { feature: "001-user-auth", artifact: "Test Coverage Matrix", path: "specs/001-user-auth/qa/test-coverage.md", status: "complete" },
      { feature: "002-quiz-engine", artifact: "Acceptance Criteria", path: "specs/002-quiz-engine/qa/acceptance-criteria.md", status: "in-progress" },
      { feature: "002-quiz-engine", artifact: "Quality Checklist", path: "specs/002-quiz-engine/qa/quality-checklist.md", status: "in-progress" },
      { feature: "002-quiz-engine", artifact: "Test Coverage Matrix", path: "specs/002-quiz-engine/qa/test-coverage.md", status: "in-progress" },
      { feature: "003-adaptive-difficulty", artifact: "Acceptance Criteria", path: "specs/003-adaptive-difficulty/qa/acceptance-criteria.md", status: "draft" },
      { feature: "003-adaptive-difficulty", artifact: "Test Coverage Matrix", path: "specs/003-adaptive-difficulty/qa/test-coverage.md", status: "draft" },
      { feature: "004-analytics-dashboard", artifact: "Acceptance Criteria", path: "specs/004-analytics-dashboard/qa/acceptance-criteria.md", status: "missing" }
    ]
  }
};
