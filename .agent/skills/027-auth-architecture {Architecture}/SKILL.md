---
name: auth-architecture
description: Firebase Auth setup. Custom claims for RBAC. Session management. MFA configuration. Provider selection.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [architecture, auth, firebase-auth, rbac]
---
# auth-architecture {Architecture} (v1.0)
> **"Auth is not a feature. It's the foundation."**
## Purpose
Designs authentication and authorization architecture using Firebase Auth. Covers provider selection, custom claims for RBAC, session management, and MFA.
**When to use:** Setting up auth for any Firebase project.
## 1. The Physics
1. **Law of Claims:** Use custom claims for roles (admin, editor, viewer). Set via Admin SDK.
2. **Law of Rules:** Firestore Security Rules read `request.auth.token` claims for authorization.
3. **Law of Providers:** Start with email/password + Google. Add others as needed.
## 2. The Protocol
### Phase 1: Select auth providers based on user requirements.
### Phase 2: Design role hierarchy and custom claims structure.
### Phase 3: Design Security Rules that enforce claims. Configure MFA if required.
## 3. Quality Gates
- [ ] Auth providers selected and documented
- [ ] Custom claims structure defined
- [ ] Security Rules enforce claims
- [ ] Session management strategy documented
