# JM-ADK Framework Principles

> Five operating principles that govern all kit behavior.

## Principle 1: Skills-First Architecture
All user-facing capabilities are delivered as AI agent skills within `.agent/skills/`. Scripts, templates, and utilities exist only to support skill execution.

## Principle 2: Dual-Mode Intelligence
The kit operates in two modes:
- **Analysis Mode** (MAO DNA): Requirements engineering, discovery, functional specifications
- **Development Mode** (SA DNA): Architecture, scaffolding, coding, testing, deployment

Mode detection is automatic. The orchestrator routes to the appropriate agent cluster.

## Principle 3: Intent Integrity Chain
Every requirement is traceable:
```
Intent → Spec → Plan → Tasks → Tests → Code
         (FR-XXX)  (D1-DN)  (T###)  (hash-locked)
```
SHA256 hashes prevent silent requirement drift. Phase separation ensures each artifact answers ONE question.

## Principle 4: Metacognitive Confidence
Complex responses require structured reasoning (DECOMPOSE → SOLVE → VERIFY → SYNTHESIZE → REFLECT) with explicit confidence scoring. Minimum threshold: 0.95. Below triggers Socratic debate and fact-checking via internet search.

## Principle 5: Firebase-Hostinger Stack Constraint
All architecture targets Firebase + Google ecosystem. Deployment compatible with Hostinger standard hosting (static + Node.js). No Docker, no K8s, no AWS, no Azure.
