---
name: penetration-testing-guide
description: OWASP Top 10 checklist for Firebase apps. Firestore rules audit. Auth flow testing. Functions input validation.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [security, pentest, owasp, audit, checklist]
---
# penetration-testing-guide {Security} (v1.0)
> **"Security is not a feature. It's every feature's foundation."**
## Purpose
OWASP Top 10 checklist for Firebase apps. Firestore rules audit. Auth flow testing. Functions input validation.
**When to use:** Implementing authentication, authorization, or security measures in Firebase projects.
## 1. The Physics
1. **Law of Auth First:** No endpoint without authentication. Firebase ID token verification is mandatory.
2. **Law of Least Privilege:** Users get minimum permissions needed. Custom claims define roles.
3. **Law of Defense in Depth:** Client validation + Security Rules + Cloud Functions validation. Three layers.
## 2. The Protocol
### Phase 1: Assess security requirements from spec.
### Phase 2: Implement auth, authorization, and security measures.
### Phase 3: Audit with OWASP checklist. Test rules with emulator.
## 3. Quality Gates
- [ ] Auth implemented on all endpoints
- [ ] Security rules cover all Firestore collections
- [ ] OWASP Top 10 mitigations addressed
- [ ] Secrets in Secret Manager (not in code)
- [ ] Privacy compliance documented
