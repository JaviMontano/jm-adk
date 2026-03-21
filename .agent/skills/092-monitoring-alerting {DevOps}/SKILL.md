---
name: monitoring-alerting
description: Firebase Crashlytics. Performance Monitoring. Cloud Logging queries. Cloud Monitoring alerts. Uptime checks.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [devops, monitoring, crashlytics, logging, alerting]
---
# monitoring-alerting {DevOps} (v1.0)
> **"Ship fast, ship safe. Automate everything between git push and production."**
## Purpose
Firebase Crashlytics. Performance Monitoring. Cloud Logging queries. Cloud Monitoring alerts. Uptime checks.
**When to use:** Deployment, CI/CD, and infrastructure management for Firebase + Hostinger.
## 1. The Physics
1. **Law of Automation:** If you do it twice, automate it. GitHub Actions for CI/CD.
2. **Law of Environments:** Dev, staging, prod. Never deploy untested code to production.
3. **Law of Rollback:** Every deployment must be reversible within 5 minutes.
## 2. The Protocol
### Phase 1: Configure infrastructure (hosting, domains, SSL, environments).
### Phase 2: Set up CI/CD pipeline (build, test, deploy).
### Phase 3: Validate deployment. Monitor. Set up alerting.
## 3. Quality Gates
- [ ] CI/CD pipeline configured and passing
- [ ] SSL certificate active
- [ ] Monitoring and alerting configured
- [ ] Rollback procedure documented and tested
- [ ] No Docker/K8s in deployment (R-003)
