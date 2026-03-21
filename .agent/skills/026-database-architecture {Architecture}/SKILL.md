---
name: database-architecture
description: Firestore document/collection modeling. Denormalization strategies. Composite indexes. Query optimization. Collection group queries.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [architecture, database, firestore, modeling]
---
# database-architecture {Architecture} (v1.0)
> **"Model for your queries, not your entities."**
## Purpose
Designs Firestore data models optimized for read patterns. Covers document/collection hierarchy, denormalization, composite indexes, and query optimization.
**When to use:** Designing or refactoring Firestore schema.
## 1. The Physics
1. **Law of Reads:** Optimize for reads. Duplicate data to avoid joins.
2. **Law of 1MB:** Documents max 1MB. If growing unbounded, use subcollections.
3. **Law of Indexes:** Composite indexes for multi-field queries. Plan before writing.
## 2. The Protocol
### Phase 1: Identify query patterns from FR-XXX.
### Phase 2: Design collections, documents, subcollections. Define indexes.
### Phase 3: Document schema with example documents.
## 3. Quality Gates
- [ ] Schema designed for actual query patterns
- [ ] No unbounded arrays in documents
- [ ] Composite indexes defined
- [ ] Security rules considered in schema design
