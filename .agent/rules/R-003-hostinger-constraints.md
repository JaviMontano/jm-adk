---
name: R-003-hostinger-constraints
version: 1.0.0
status: production
enforcement: mandatory
---

# R-003: Hostinger Deployment Constraints

> **"If it can't run on Hostinger, it can't ship."**

## Definition
All deployment outputs MUST be compatible with Hostinger standard web hosting.

### ALLOWED
- Static HTML/CSS/JS (uploaded via SFTP or Git)
- Node.js hosting (Business/Cloud plans with PM2)
- PHP 8.x (if needed for specific integrations)

### BLOCKED
- Docker containers, docker-compose, Dockerfile
- Kubernetes, Helm charts, K8s manifests
- Serverless beyond Firebase Functions

### Constraints
- Max upload: 256MB per file via File Manager
- SSH: Available on Business and Cloud plans
- Management: cPanel/hPanel
- SSL: Free Let's Encrypt, custom SSL supported

## Enforcement
- scope-guard (skill 004) blocks Docker/K8s references in deployment outputs
- Deployment skills (088-089) validate Hostinger compatibility
