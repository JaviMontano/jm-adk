---
name: backup-recovery
description: gcloud firestore export. Scheduled backups via Cloud Scheduler. Point-in-time recovery. Import procedures. Disaster recovery.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [data, backup, recovery, export, disaster-recovery]
---
# backup-recovery {Data} (v1.0)
> **"Data is the product. Model it for queries, secure it with rules, back it up daily."**
## Purpose
gcloud firestore export. Scheduled backups via Cloud Scheduler. Point-in-time recovery. Import procedures. Disaster recovery.
**When to use:** Database design, data management, or analytics within Firebase ecosystem.
## 1. The Physics
1. **Law of Queries:** Design schema for read patterns. Firestore charges per read/write.
2. **Law of Rules:** Security rules are mandatory. No collection without rules.
3. **Law of Backups:** Production data gets scheduled backups. No exceptions.
## 2. The Protocol
### Phase 1: Design data model from requirements.
### Phase 2: Implement with security rules and indexes.
### Phase 3: Test with emulator. Validate rules. Set up backups.
## 3. Quality Gates
- [ ] Schema designed for actual query patterns
- [ ] Security rules cover all collections
- [ ] Indexes defined for compound queries
- [ ] Backup strategy documented
- [ ] No SQL-style normalized design in Firestore
