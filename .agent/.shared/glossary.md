# Glossary

> Key terms used across the JM Agentic Development Kit. Alphabetical order.

---

| Term | Definition |
|---|---|
| **10x Standard** | Quality threshold defined by the skill-forge rubric. A skill or artifact must score 10/10 across all evaluation dimensions to be considered production-ready. |
| **App Check** | Firebase service that protects backend resources from abuse by verifying that requests originate from legitimate app instances (reCAPTCHA Enterprise, SafetyNet, DeviceCheck). |
| **Cloud Functions** | Firebase / Google Cloud serverless compute service. Runs Node.js code in response to HTTP requests, Firestore changes, Auth events, Storage uploads, Pub/Sub messages, and cron schedules. |
| **Custom Claims** | Key-value metadata attached to a Firebase Auth user token via the Admin SDK. Used for role-based access control (RBAC) — e.g., `{ role: 'admin' }`. Propagated on the next token refresh. |
| **Dual Mode** | Operating paradigm of the kit. **Analysis mode** (MAO DNA) focuses on requirements, domain modeling, and functional specification. **Development mode** (SA DNA) focuses on code generation, testing, and deployment. |
| **Evidence Tags** | Mandatory provenance markers on every claim or decision: `[CODE]` (source code reference), `[CONFIG]` (configuration file), `[DOC]` (documentation), `[INFERENCE]` (logical deduction), `[ASSUMPTION]` (unverified premise). |
| **Firebase Hosting** | Google's CDN-backed static hosting service. Supports custom domains, preview channels, SPA rewrites, and Cloud Run integration. |
| **Firestore** | Firebase's NoSQL document database. Data is organized as documents within collections. Supports real-time listeners, offline persistence, composite indexes, and server-side security rules. |
| **Hostinger** | Web hosting provider used for serving static frontends. Supports HTML/CSS/JS, PHP, and Node.js (on VPS/Cloud plans). Does not support Docker or serverless functions natively. |
| **MOAT** | Standard directory structure for skills: `reference/` (context documents), `prompts/` (instruction templates), `examples/` (sample inputs/outputs), `tests/` (validation cases). |
| **Quality Gates** | Checkpoints in the analysis-to-code lifecycle that validate completeness before proceeding: **G0** (pre-flight input validation), **G1** (analysis completeness), **G2** (architecture approval), **G3** (deployment readiness). |
| **RTDB** | Firebase Realtime Database. A JSON-tree database optimized for low-latency reads and writes. Best suited for presence, typing indicators, and live collaboration features. |
| **Security Rules** | Declarative access-control language for Firestore and Cloud Storage. Rules evaluate against request context (`request.auth`, `request.resource`) to allow or deny operations. |
| **Trinity** | The 3-step skill lifecycle: **Alfa** (Reasoning — analyze the problem, gather context, plan approach), **Atoms** (Artifacts — generate code, configs, documents), **Beta** (Refining — test, iterate, polish to 10x standard). |

---

*Last updated: 2026-03-21*
