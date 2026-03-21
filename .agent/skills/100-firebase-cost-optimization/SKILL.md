---
name: firebase-cost-optimization
description: Firestore read/write reduction, Functions cold start mitigation, Storage lifecycle rules, and billing alerts
version: 1.0.0
status: production
owner: Javier Montaño
tags: [performance, firebase, cost, firestore, cloud-functions, storage, billing]
---

# 100 — Firebase Cost Optimization {Performance}

## Purpose
Minimize Firebase operational costs while maintaining application performance. Reduce Firestore reads/writes through efficient query patterns, mitigate Cloud Functions cold starts, and implement storage lifecycle management.

## Physics — 3 Immutable Laws

1. **Law of Read Reduction**: Every Firestore read costs money. Cache aggressively, paginate always, denormalize strategically. Never read more documents than displayed.
2. **Law of Function Efficiency**: Cloud Functions bill per invocation and compute time. Minimize cold starts, reduce execution duration, avoid unnecessary triggers.
3. **Law of Storage Hygiene**: Unused files in Firebase Storage cost money monthly. Lifecycle rules delete temp files. User-uploaded originals are cleaned after processing.

## Protocol

### Phase 1 — Firestore Optimization
1. **Pagination**: Every list query uses `limit()` + cursor-based pagination (`startAfter`). Never `getDocs()` without limit.
2. **Caching**: Enable Firestore persistence (`enablePersistence()`). Use `getDocFromCache()` before `getDocFromServer()`.
3. **Denormalization**: Store computed/aggregated data to avoid multi-document reads. Update via Cloud Function triggers.
4. **Composite queries**: Replace multiple queries with composite indexes. Use `in` operator for batch lookups (max 30 values).
5. **Listener management**: `onSnapshot` unsubscribe on component unmount. No orphan listeners.

### Phase 2 — Cloud Functions Optimization
1. **Min instances**: Set `minInstances: 1` for critical functions to eliminate cold starts.
2. **Lazy imports**: Import heavy SDKs inside function body, not at module top level.
3. **Regional deployment**: Deploy functions in same region as Firestore to reduce latency and egress.
4. **Batch triggers**: Use `onWrite` batch processing instead of individual `onCreate` for bulk operations.
5. **Timeout/memory**: Right-size function memory (128MB default). Set timeout to actual max expected + 20%.

### Phase 3 — Storage & Billing Controls
1. **Lifecycle rules**: Auto-delete temp files after 7 days via Cloud Storage lifecycle policy.
2. **Image cleanup**: Delete original after resize extension processes it (keep resized only).
3. **Billing alerts**: Set alerts at 50%, 80%, 100% of monthly budget in Google Cloud Console.
4. **Budget cap**: Configure billing budget with auto-disable for non-production projects.

## I/O

| Input | Output |
|-------|--------|
| Firestore query patterns | Optimized queries with pagination + caching |
| Cloud Functions config | Right-sized memory, timeout, min instances |
| Storage file inventory | Lifecycle rules for auto-cleanup |
| Monthly budget | Billing alerts and caps configured |

## Quality Gates — 5 Checks

1. **Every query has `limit()`** — no unbounded reads.
2. **Firestore persistence enabled** — offline cache active on client.
3. **Min instances set for critical functions** — cold start < 500ms.
4. **Billing alerts at 50%, 80%, 100%** — configured in Cloud Console.
5. **Storage lifecycle active** — temp files auto-deleted after 7 days.

## Edge Cases

- **Firestore listener explosion**: Shared state via context — one listener per collection, not per component.
- **Functions concurrency**: Gen2 functions support concurrency. Set `concurrency: 80` to reduce instance count.
- **Spark plan limits**: Free tier has 50K reads/day, 20K writes/day. Monitor to avoid hard limit.
- **Egress costs**: Firestore egress is free within same region. Cross-region reads incur egress charges.

## Self-Correction Triggers

- Billing exceeds 80% of budget → audit top cost drivers in Cloud Console.
- Firestore reads > 50K/day → review queries, add caching, increase denormalization.
- Functions cold start > 2s → add min instances, reduce imports, check memory allocation.
- Storage costs growing → run file inventory, verify lifecycle rules, delete unused assets.
