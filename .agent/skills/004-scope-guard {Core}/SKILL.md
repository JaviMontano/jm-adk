---
name: scope-guard
description: Stack constraint enforcer. Blocks AWS, Azure, Docker, K8s references and redirects to Firebase/Google/Hostinger equivalents.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [core, governance, constraints, stack]
---

# scope-guard {Core} (v1.0)

> **"Firebase or nothing. Hostinger or nowhere. No exceptions."**

## Purpose

Enforces the kit's technology stack boundaries defined in R-002 (Firebase Stack Policy) and R-003 (Hostinger Constraints). Intercepts and redirects any references to out-of-scope technologies.

**When to use:**

- Active during every skill execution (implicit guard)
- When reviewing generated architecture or code for compliance
- When user requests technologies outside the allowed stack

---

## 1. The Physics (Immutable Laws)

1. **Law of Firebase-First:** All backend, database, auth, and hosting decisions default to Firebase services.
2. **Law of Hostinger-Fit:** All deployment outputs must be compatible with Hostinger standard hosting (static + Node.js).
3. **Law of Redirection:** Never just block — always suggest the Firebase/Google/Hostinger equivalent.

---

## 2. The Protocol (Step-by-Step)

### Phase 1: Detection

1. **Scan for blocked technologies:**
   - AWS: Lambda, S3, DynamoDB, EC2, RDS, SQS, SNS, CloudFront, API Gateway
   - Azure: Functions, Cosmos DB, Blob Storage, App Service
   - Containers: Docker, Kubernetes, docker-compose, Dockerfile
   - Other serverless: Vercel Functions, Netlify Functions, Cloudflare Workers
   - Other databases: MongoDB Atlas, Supabase, PlanetScale, Neon

### Phase 2: Redirection

1. **Map to Firebase/Google equivalent:**
   - Lambda/Azure Functions → Firebase Cloud Functions
   - S3/Blob Storage → Firebase Cloud Storage
   - DynamoDB/Cosmos DB → Firestore
   - RDS/SQL databases → Firestore (or Cloud SQL if absolutely needed)
   - SQS/SNS → Cloud Tasks / Pub/Sub
   - CloudFront → Firebase Hosting CDN
   - Docker → Direct Node.js deployment on Hostinger
   - Vercel/Netlify → Firebase Hosting + Hostinger

### Phase 3: Communication

1. **Inform user** of the redirection with rationale.
2. **Document** the constraint in the architecture decision log.

---

## 3. Inputs / Outputs

### Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Content to scan | Text/Code | Yes | Architecture docs, code, or user requests |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| Compliance Status | Boolean | Pass/Fail |
| Violations | List | Detected out-of-scope references |
| Redirections | List | Suggested Firebase/Google alternatives |

---

## 4. Quality Gates (10x Checklist)

- [ ] **No AWS references** in any generated output
- [ ] **No Azure references** in any generated output
- [ ] **No Docker/K8s references** in deployment outputs
- [ ] **All databases** point to Firestore or Firebase RTDB
- [ ] **All hosting** targets Firebase Hosting or Hostinger

---

## 5. Edge Cases & Antipatterns

### Antipatterns

- **Silent blocking:** Removing technology references without informing user → **BAD**
- **Rigid rejection:** "That's not allowed" with no alternative → **BAD**

### Edge Cases

- **Google Cloud services:** Cloud Tasks, Pub/Sub, Secret Manager, BigQuery are ALLOWED (they're Google ecosystem).
- **Third-party SaaS:** Algolia, SendGrid, Stripe are ALLOWED as integrations via Cloud Functions.
- **npm packages:** Any npm package is ALLOWED as long as it runs in Node.js on Hostinger or Cloud Functions.

---

## 6. Self-Correction Triggers

> [!WARNING]
> IF user insists on AWS/Azure THEN explain: "This kit targets Firebase/Google ecosystem exclusively per R-002. For AWS/Azure projects, use a different toolkit."

> [!WARNING]
> IF a Docker reference appears in deployment output THEN replace with Hostinger Node.js hosting instructions per R-003.
