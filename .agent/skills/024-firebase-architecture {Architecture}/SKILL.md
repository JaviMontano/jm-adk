---
name: firebase-architecture
description: End-to-end Firebase project architecture. Firestore schema strategy, Cloud Functions topology, Hosting config, Security Rules design. C4 diagram output.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [architecture, firebase, design, c4]
---
# firebase-architecture {Architecture} (v1.0)
> **"Firebase is the platform. Architecture is how you use it without hitting walls."**
## Purpose
Designs complete Firebase project architecture covering Firestore data model, Cloud Functions topology, Hosting configuration, Security Rules strategy, and service integration patterns.
**When to use:**
- Starting a new Firebase project
- Redesigning an existing Firebase architecture
- When `/jm:design-architecture` targets Firebase
## 1. The Physics
1. **Law of Denormalization:** Firestore rewards reading over writing. Model for your queries, not your entities.
2. **Law of Triggers:** Cloud Functions react to events. Design event chains, not request chains.
3. **Law of Rules:** Security Rules are your last line. Design them BEFORE implementation.
## 2. The Protocol
### Phase 1: Service Selection
1. Map FR-XXX requirements to Firebase services (Auth, Firestore, Functions, Hosting, Storage).
2. Identify Google Cloud services needed (Cloud Tasks, Pub/Sub, Secret Manager).
3. Identify third-party integrations (Algolia, SendGrid, Stripe).
### Phase 2: Architecture Design
1. Design Firestore collection hierarchy (top-level collections, subcollections, composite indexes).
2. Design Cloud Functions topology (HTTP triggers, Firestore triggers, Auth triggers, scheduled).
3. Design Security Rules strategy (role-based via custom claims, resource-based).
4. Design Hosting config (rewrites for SPA, headers, preview channels).
5. Produce C4 context and container diagrams (Mermaid).
### Phase 3: Document
1. Write architecture document with service matrix.
2. Create ADR for significant decisions.
3. Estimate Firebase costs (reads/writes/invocations).
## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| spec.md or requirements | File/Text | Yes | What to build |
| Output | Type | Description |
|--------|------|-------------|
| Architecture document | Markdown | C4 diagrams + service matrix |
| ADR | File | Key decisions |
## 4. Quality Gates
- [ ] All FR-XXX mapped to Firebase services
- [ ] Firestore schema designed for query patterns
- [ ] Security Rules strategy documented
- [ ] C4 diagrams produced (Mermaid)
- [ ] No AWS/Azure references (R-002)
## 5. Self-Correction Triggers
> [!WARNING]
> IF designing SQL-style normalized schema THEN **STOP**. Firestore requires denormalization.
> IF adding Docker/K8s to architecture THEN **STOP**. Use Firebase Hosting + Hostinger (R-003).
