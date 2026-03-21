---
name: R-002-firebase-stack-policy
version: 1.0.0
status: production
enforcement: mandatory
---

# R-002: Firebase Stack Policy

> **"Firebase or nothing. Google ecosystem or nowhere."**

## Definition
All architecture, scaffolding, and backend skills target Firebase + Google ecosystem exclusively.

### ALLOWED
- Firebase: Auth, Firestore, RTDB, Functions, Hosting, Storage, Analytics, Crashlytics, Performance, FCM, Remote Config, App Check, Extensions
- Google Cloud: Cloud Tasks, Pub/Sub, Secret Manager, BigQuery, Cloud Scheduler, Cloud Logging
- Google APIs: Sheets v4, Docs v1, Calendar v3, Maps JS, YouTube Data v3
- Third-party SaaS via Cloud Functions: Algolia, SendGrid, Stripe, Twilio

### BLOCKED
- AWS: Lambda, S3, DynamoDB, EC2, RDS, SQS, SNS, CloudFront, API Gateway, Cognito
- Azure: Functions, Cosmos DB, Blob Storage, App Service, AD B2C
- Other serverless: Vercel Functions, Netlify Functions, Cloudflare Workers
- Other databases: MongoDB Atlas, Supabase, PlanetScale, Neon

## Enforcement
- scope-guard (skill 004) scans all outputs for blocked references
- Blocked reference detected → suggest Firebase/Google equivalent
