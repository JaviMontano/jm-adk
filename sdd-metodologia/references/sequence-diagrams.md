# SDD Sequence Diagrams — Tool Use Flows

> Mermaid diagrams documenting every SDD automation flow.
> SDD v3.0 · MetodologIA

---

## 1. Per-Prompt Heartbeat

```mermaid
sequenceDiagram
    participant U as User
    participant Hook as UserPromptSubmit
    participant HB as sdd-heartbeat-lite.sh
    participant ST as sentinel-state.json
    participant C as Claude

    U->>Hook: Submit prompt
    Hook->>HB: Execute (< 100ms)
    HB->>HB: Check .specify/ exists
    alt No .specify/
        HB-->>Hook: exit 0 (silent — not SDD project)
    else SDD project
        HB->>ST: Read suppressedUntil
        alt Suppressed
            HB-->>Hook: exit 0 (silent)
        else Active
            HB->>HB: find stale (>7d), check CONSTITUTION, PREMISE, context.json
            HB->>HB: grep last health score from health-history.json
            alt Findings
                HB-->>Hook: stdout: "⚡ SDD: 2 stale, health:CRITICAL:38 — /sdd:sentinel"
            else Clean
                HB-->>Hook: exit 0 (empty stdout)
            end
        end
    end
    Hook->>C: Forward prompt + injected context (if any)
    C->>U: Response
```

---

## 2. Full Sentinel Cycle

```mermaid
sequenceDiagram
    participant U as User
    participant S as /sdd:sentinel
    participant SH as sdd-sentinel.sh
    participant FS as Filesystem
    participant ST as sentinel-state.json
    participant HH as health-history.json

    U->>S: /sdd:sentinel
    S->>SH: Execute with project-path

    Note over SH: PERCEIVE (zero LLM)
    SH->>FS: P1: Stat all spec.md, plan.md, tasks.md
    SH->>FS: P2: Check artifact freshness (>7d WARNING, >14d CRITICAL)
    SH->>FS: P3: Read context.json phase states
    SH->>FS: P4: SHA256 of .feature files vs stored hash
    SH->>FS: P5: Grep FR-NNN in tasks vs spec (orphan detection)
    SH->>FS: P6: Read last health score baseline

    Note over SH: DECIDE (zero LLM)
    SH->>ST: D1: Check suppression window
    SH->>SH: D2: Classify staleness severity
    SH->>SH: D3: Detect pipeline anomalies
    SH->>SH: D4: Flag integrity violations
    SH->>SH: D5: Count cross-reference breaks
    SH->>SH: D6: Check health regression (>10 pts)
    SH->>SH: D7: Compute suppression duration

    Note over SH: ACT (LLM only if findings)
    SH->>HH: A1: Append health snapshot
    SH->>ST: A2: Write findings + suppression window
    SH-->>U: Visual report (branded) or JSON (--json)
```

---

## 3. Dashboard Generation

```mermaid
sequenceDiagram
    participant U as User
    participant D as /sdd:dashboard
    participant G as generate-dashboard.js
    participant FS as Filesystem
    participant T as dashboard-template.html
    participant O as .specify/dashboard/

    U->>D: /sdd:dashboard
    D->>G: Execute with project-path

    G->>FS: Read CONSTITUTION.md
    G->>FS: Read PREMISE.md
    G->>FS: Discover specs/NNN-*/ directories

    loop Each feature
        G->>FS: Read spec.md → parse FR/US/SC
        G->>FS: Read plan.md → parse design decisions
        G->>FS: Read tasks.md → parse T-NNN, [x]/[ ]
        G->>FS: Read checklists/*.md → parse items
        G->>FS: Read tests/features/*.feature → parse scenarios
    end

    G->>FS: Read health-history.json → trends
    G->>FS: Read knowledge-graph.json → nodes/edges
    G->>FS: Read rag-index.json → memory files
    G->>FS: Read session-log.json → activity feed
    G->>FS: Walk directory tree → filesystem snapshot

    G->>G: Build DASHBOARD_DATA JSON
    G->>T: Read template HTML
    G->>G: Inject data + design tokens

    alt --multi mode
        G->>O: Write index.html (Command Center)
        G->>O: Write pipeline.html, specs.html, quality.html
        G->>O: Write intelligence.html, workspace.html, governance.html
        G->>O: Write shared/nav.js, tokens.css, data.js
    else --single mode
        G->>O: Write dashboard.html (single file)
    end

    G-->>U: Dashboard ready at .specify/dashboard/
```

---

## 4. Knowledge Graph Build

```mermaid
sequenceDiagram
    participant U as User
    participant KG as sdd-knowledge-graph.js
    participant FS as Filesystem
    participant OUT as knowledge-graph.json

    U->>KG: node sdd-knowledge-graph.js <path>

    KG->>FS: Read CONSTITUTION.md
    KG->>KG: Parse Roman numeral principles → P-I, P-II nodes

    KG->>FS: List specs/NNN-*/ directories
    loop Each feature
        KG->>FS: Read spec.md
        KG->>KG: Extract FR-NNN → requirement nodes
        KG->>KG: Extract US-NNN → user-story nodes
        KG->>KG: Extract SC-NNN → success-criteria nodes

        KG->>FS: Read tests/features/*.feature
        KG->>KG: Extract @TS-NNN → test-spec nodes
        KG->>KG: Extract @FR/@US tags → verified_by edges

        KG->>FS: Read tasks.md
        KG->>KG: Extract T-NNN → task nodes
        KG->>KG: Extract FR refs → implemented_by edges
    end

    KG->>KG: Heuristic: principle keywords in specs → governs edges
    KG->>KG: Compute orphans (untested, untraced, unlinked)
    KG->>KG: Compute stats (coverage %)

    KG->>OUT: Write .specify/knowledge-graph.json
    KG-->>U: stderr: "Knowledge Graph: 45 nodes, 89 edges, 3 orphans, coverage: 87%"
```

---

## 5. RAG Capture Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as /sdd:capture
    participant RC as sdd-rag-capture.sh
    participant FS as Filesystem
    participant IDX as rag-index.json
    participant LLM as Claude (abstract gen)

    U->>C: /sdd:capture <file-or-url>
    C->>RC: Execute with input path

    RC->>FS: Detect file type (file -b --mime-type)

    alt text/html
        RC->>FS: Extract <title>, <style> tokens, component structure
    else image/*
        RC->>RC: Generate placeholder description
    else audio/*
        RC->>RC: Generate transcription placeholder
    else application/pdf
        RC->>RC: Count pages, extract section titles
    else text/*
        RC->>FS: Read full content verbatim
    end

    RC->>RC: Generate slug from filename
    RC->>FS: Write rag-memory-of-{slug}.md (frontmatter + content)

    RC->>LLM: Generate abstract + key takeaways + insights
    RC->>FS: Update rag-memory-of-{slug}.md with LLM output

    RC->>IDX: Append entry to .specify/rag-index.json
    RC-->>U: "Captured: rag-memory-of-{slug}.md (type: text/html, 4.2KB)"
```

---

## 6. SDD Full Pipeline (9 Phases)

```mermaid
sequenceDiagram
    participant U as User
    participant P0 as Phase 0: Constitution
    participant P1 as Phase 1: Specify
    participant P2 as Phase 2: Plan
    participant P3 as Phase 3: Checklist
    participant P4 as Phase 4: Testify
    participant P5 as Phase 5: Tasks
    participant P6 as Phase 6: Analyze
    participant P7 as Phase 7: Implement
    participant P8 as Phase 8: Issues

    U->>P0: /sdd:00-constitution
    P0->>P0: Define principles, quality standards
    Note over P0: Output: CONSTITUTION.md

    U->>P1: /sdd:spec
    P1->>P1: Feature spec from natural language
    Note over P1: Output: spec.md (FR, US, SC)
    Note over P1,P2: ──── GATE G1 ────

    U->>P2: /sdd:plan
    P2->>P2: Technical design + data model
    Note over P2: Output: plan.md, data-model.md

    U->>P3: /sdd:check
    P3->>P3: Quality checklists (unit tests for English)
    Note over P3: Output: checklists/*.md

    U->>P4: /sdd:test
    P4->>P4: BDD Gherkin specs + assertion hashing
    Note over P4: Output: tests/features/*.feature
    Note over P4,P5: ──── GATE G2 ────

    U->>P5: /sdd:tasks
    P5->>P5: Dependency-ordered task breakdown
    Note over P5: Output: tasks.md (T-NNN)

    U->>P6: /sdd:analyze
    P6->>P6: Cross-artifact consistency check
    Note over P6: Output: analysis.md, CLARIFICATIONS.md
    Note over P6,P7: ──── GATE G3 ────

    U->>P7: /sdd:impl
    P7->>P7: Execute implementation (TDD, parallel)
    Note over P7: Output: code + tests passing

    U->>P8: /sdd:issues
    P8->>P8: Export tasks to GitHub Issues
    Note over P8: Output: GitHub Issues with labels
```

---

## 7. Hook Lifecycle

```mermaid
sequenceDiagram
    participant U as User
    participant SS as SessionStart Hook
    participant UP as UserPromptSubmit Hook
    participant PT as PreToolUse Hook
    participant PO as PostToolUse Hook
    participant PC as PreCompact Hook
    participant C as Claude

    Note over SS: Session begins
    SS->>SS: sdd-heartbeat-lite.sh --init
    SS->>SS: Create sentinel-state.json if missing

    U->>UP: User submits prompt
    UP->>UP: sdd-heartbeat-lite.sh (< 100ms)
    UP-->>C: Context injection (if findings)

    C->>PT: Before Write/Edit tool
    Note over PT: (Reserved for future: constitution validation)

    C->>C: Execute Write/Edit tool

    C->>PO: After Write/Edit tool
    PO->>PO: sdd-session-log.sh post-write
    PO->>PO: Log event to session-log.json

    Note over PC: Context window filling up
    PC->>PC: sdd-session-log.sh pre-compact
    PC->>PC: Snapshot critical state before compaction

    Note over U,C: Cycle repeats for each prompt
```
