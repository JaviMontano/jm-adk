---
name: pwa-architecture
description: Progressive Web App design. Service workers, Web App Manifest, offline-first, push notifications via FCM.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [architecture, pwa, offline, service-worker]
---
# pwa-architecture {Architecture} (v1.0)
> **"Architecture is decisions. Document every one."**
## Purpose
Progressive Web App design. Service workers, Web App Manifest, offline-first, push notifications via FCM.
**When to use:** When designing or reviewing architecture for Firebase/Google stack projects.
## 1. The Physics
1. **Law of Firebase-First:** All architecture decisions constrained to Firebase/Google ecosystem (R-002).
2. **Law of Evidence:** Every architectural claim tagged [CODE], [CONFIG], [DOC], [INFERENCE], or [ASSUMPTION].
3. **Law of Diagrams:** Architecture without diagrams is incomplete. Use Mermaid for C4, sequence, flow.
## 2. The Protocol
### Phase 1: Analyze requirements and constraints.
### Phase 2: Design architecture with Firebase/Google services.
### Phase 3: Document with C4 diagrams, decision records, and evidence tags.
## 3. Quality Gates
- [ ] Architecture designed within Firebase/Google/Hostinger constraints
- [ ] C4 or sequence diagrams produced (Mermaid)
- [ ] Evidence tags on all claims
- [ ] ADR created for significant decisions
- [ ] No AWS/Azure/Docker references
