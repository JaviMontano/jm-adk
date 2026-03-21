---
name: api-designer
description: REST/GraphQL API design for Firebase Cloud Functions. OpenAPI spec generation. Versioning strategy. Rate limiting patterns.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [architecture, api, rest, graphql, cloud-functions]
---
# api-designer {Architecture} (v1.0)
> **"An API is a contract. Design it before you code it."**
## Purpose
Designs REST or GraphQL APIs implemented as Firebase Cloud Functions HTTP triggers. Produces OpenAPI specs, defines versioning, and establishes rate limiting patterns.
**When to use:**
- Designing Cloud Functions HTTP endpoints
- Creating API contracts before implementation
## 1. The Physics
1. **Law of Contract-First:** OpenAPI/GraphQL schema BEFORE code. No coding without a spec.
2. **Law of Versioning:** URL-based versioning (`/v1/`, `/v2/`). Never break existing consumers.
3. **Law of Functions:** Each endpoint = one Cloud Function. Shared middleware via middleware chain.
## 2. The Protocol
### Phase 1: Design
1. Map FR-XXX to endpoints (CRUD operations).
2. Define request/response schemas.
3. Design auth middleware (Firebase ID token verification).
### Phase 2: Document
1. Generate OpenAPI 3.0 spec or GraphQL schema.
2. Define error response format (code, message, details).
3. Document rate limiting strategy.
## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| spec.md | File | Yes | Requirements |
| Output | Type | Description |
|--------|------|-------------|
| API spec | OpenAPI/GraphQL | Contract document |
## 4. Quality Gates
- [ ] All endpoints have request/response schemas
- [ ] Auth middleware defined
- [ ] Error format standardized
- [ ] Versioning strategy documented
## 5. Self-Correction Triggers
> [!WARNING]
> IF designing endpoints without auth THEN add Firebase ID token verification middleware.
