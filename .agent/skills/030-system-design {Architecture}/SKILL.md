---
name: system-design
description: End-to-end system design. Frontend + Firebase backend + Google APIs + third-party integrations. Sequence diagrams. Deployment topology.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [architecture, system-design, end-to-end, integration]
---
# system-design {Architecture} (v1.0)
> **"The system is the sum of its integrations."**
## Purpose
Produces end-to-end system design combining frontend (React/Angular/HTML), Firebase backend, Google APIs, and third-party services into a coherent architecture.
**When to use:** When the project involves multiple services and integrations.
## 1. The Physics
1. **Law of Boundaries:** Each service has clear boundaries (frontend, backend, database, external).
2. **Law of Contracts:** Service-to-service communication via defined contracts (API specs, event schemas).
3. **Law of Failure:** Design for failure. Every external call needs error handling and fallback.
## 2. The Protocol
### Phase 1: Map all system components (frontend, Firebase services, Google APIs, third-party).
### Phase 2: Design interaction patterns (sync API calls, async events, real-time listeners).
### Phase 3: Produce sequence diagrams (Mermaid) for key flows. Document deployment topology.
## 3. Quality Gates
- [ ] All components identified and bounded
- [ ] Interaction patterns documented
- [ ] Sequence diagrams for key flows
- [ ] Error handling for all external calls
