---
name: ci-cd-pipeline
description: GitHub Actions workflow: build, lint, test, deploy. Firebase deploy token. Branch-based environments. Artifact caching.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [devops, ci-cd, github-actions, deploy, automation]
---
# ci-cd-pipeline {DevOps} (v1.0)
> **"Ship fast, ship safe. Automate everything between git push and production."**
## Purpose
GitHub Actions workflow: build, lint, test, deploy. Firebase deploy token. Branch-based environments. Artifact caching.
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
