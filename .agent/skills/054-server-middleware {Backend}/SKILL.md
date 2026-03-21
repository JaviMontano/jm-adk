---
name: server-middleware
description: Auth verification (verifyIdToken), rate limiting, CORS config, request logging, input sanitization middleware.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [backend, middleware, auth, cors, rate-limiting]
---
# server-middleware {Backend} (v1.0)
> **"Firebase Functions are your backend. Design them like microservices, deploy them like magic."**
## Purpose
Auth verification (verifyIdToken), rate limiting, CORS config, request logging, input sanitization middleware.
**When to use:** Backend development within Firebase/Google ecosystem.
## 1. The Physics
1. **Law of Functions:** Each Cloud Function does ONE thing. Single responsibility.
2. **Law of Cold Start:** Minimize dependencies. Use lazy imports. Set min instances for critical functions.
3. **Law of Security:** Every HTTP function verifies Firebase ID tokens. No public endpoints without auth.
## 2. The Protocol
### Phase 1: Design
1. Map requirements to Cloud Functions triggers (HTTP, Firestore, Auth, Storage, scheduled).
2. Define input/output contracts for each function.
3. Design error handling and retry strategy.
### Phase 2: Implement
1. Create function with proper trigger type.
2. Add auth middleware for HTTP functions.
3. Implement business logic with error handling.
4. Add Cloud Logging for observability.
### Phase 3: Test + Deploy
1. Test with Firebase Emulator Suite.
2. Deploy with `firebase deploy --only functions`.
3. Verify in Firebase Console.
## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Requirements | Text/Spec | Yes | What the function does |
| Output | Type | Description |
|--------|------|-------------|
| Cloud Function code | TypeScript | Deployable function |
## 4. Quality Gates
- [ ] Single responsibility per function
- [ ] Auth middleware on HTTP endpoints
- [ ] Error handling with Cloud Logging
- [ ] Emulator tests pass
- [ ] No AWS/Azure services (R-002)
## 5. Self-Correction Triggers
> [!WARNING]
> IF function has no auth middleware THEN add verifyIdToken check.
> IF function imports 10+ dependencies THEN split or lazy-load to reduce cold start.
