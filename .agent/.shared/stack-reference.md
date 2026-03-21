# Stack Reference — Firebase + Google Ecosystem

> Canonical technology reference for the JM Agentic Development Kit.
> All projects built with this kit target the Firebase + Google Cloud stack deployed to Firebase Hosting and/or Hostinger.

---

## 1. Firebase Auth

| Capability | Notes |
|---|---|
| Email / Password | `createUserWithEmailAndPassword`, email verification, password reset |
| OAuth Providers | Google, GitHub, Microsoft, Apple, Facebook, Twitter |
| Phone Auth | SMS verification, reCAPTCHA verifier |
| Anonymous Auth | Temporary UID, convertible to permanent account |
| Custom Tokens | Server-side `admin.auth().createCustomToken(uid, claims)` |
| MFA | TOTP and SMS second factors via `multiFactor` API |
| Custom Claims | RBAC metadata set via Admin SDK, propagated on token refresh |
| App Check | Device attestation (reCAPTCHA Enterprise, SafetyNet, DeviceCheck) |
| Session Management | ID tokens (1 h), refresh tokens, `onAuthStateChanged` listener |

**SDK entry point**: `import { getAuth } from 'firebase/auth'`

---

## 2. Cloud Firestore

| Concept | Detail |
|---|---|
| Data model | Documents inside collections; each document is a JSON-like map |
| Subcollections | Nested collections scoped to a parent document |
| Queries | Compound queries, `where`, `orderBy`, `limit`, `startAfter` |
| Composite Indexes | Required for multi-field queries; managed via `firestore.indexes.json` |
| TTL | Time-to-live policies delete documents after a timestamp field expires |
| Offline Persistence | Enabled by default on mobile; `enablePersistentCacheIndexAutoCreation()` on web |
| Security Rules | `match /collection/{docId}` with `allow read, write: if <condition>` |
| Transactions | `runTransaction()` for atomic read-then-write sequences |
| Batched Writes | Up to 500 operations per batch |
| Real-time Listeners | `onSnapshot()` for live document / query updates |
| Field Transforms | `arrayUnion`, `arrayRemove`, `increment`, `serverTimestamp` |

**Limits**: 1 MiB max document size, 1 write/sec sustained per document.

---

## 3. Firebase Realtime Database (RTDB)

| Concept | Detail |
|---|---|
| Data model | Single JSON tree up to 32 levels deep |
| Listeners | `onValue`, `onChildAdded`, `onChildChanged`, `onChildRemoved` |
| Presence | `.info/connected` + `onDisconnect()` for online/offline tracking |
| Priority | Legacy ordering mechanism; prefer `orderByChild` |
| Fan-out | Multi-path updates: `update({ '/posts/id': post, '/user-posts/uid/id': post })` |
| Security Rules | JSON-based rules with `.read`, `.write`, `.validate` |

**Use when**: You need sub-100 ms latency for presence, typing indicators, or live cursors.

---

## 4. Cloud Functions for Firebase

| Aspect | Detail |
|---|---|
| Runtime | Node.js 20 (LTS) — also supports Node.js 18 |
| 2nd Gen | Built on Cloud Run; concurrency, min instances, CPU/memory config |
| HTTP Triggers | `onRequest()` — Express-compatible request/response |
| Callable | `onCall()` — typed RPC with Auth context auto-injected |
| Firestore Triggers | `onDocumentCreated`, `onDocumentUpdated`, `onDocumentDeleted`, `onDocumentWritten` |
| Auth Triggers | `beforeUserCreated`, `beforeUserSignedIn`, `onUserCreated`, `onUserDeleted` |
| Storage Triggers | `onObjectFinalized`, `onObjectDeleted`, `onObjectArchived` |
| Pub/Sub Triggers | `onMessagePublished` |
| Scheduled | `onSchedule({ schedule: 'every 5 minutes' })` via Cloud Scheduler |
| Task Queue | `onTaskDispatched` — durable async processing |
| Secrets | `defineSecret('API_KEY')` integrated with Secret Manager |
| Environment | `defineString`, `defineInt` for parameterized config |

**Deploy**: `firebase deploy --only functions`

---

## 5. Firebase Hosting

| Feature | Detail |
|---|---|
| Static hosting | Serves HTML, CSS, JS, images from global CDN |
| Custom domains | Map any domain; automatic SSL provisioning |
| Preview channels | `firebase hosting:channel:deploy preview-name` — temporary URLs |
| Rewrites | SPA fallback: `{ "source": "**", "destination": "/index.html" }` |
| Redirects | 301/302 redirects in `firebase.json` |
| Headers | Custom cache-control, CORS, security headers |
| Cloud Run integration | Proxy dynamic routes to Cloud Run services |
| Multi-site | Multiple sites per Firebase project |

---

## 6. Cloud Storage for Firebase

| Feature | Detail |
|---|---|
| Upload | `uploadBytesResumable()` with progress tracking |
| Download | `getDownloadURL()` returns signed URL |
| Security Rules | Path-based rules with `request.auth`, file size/content-type validation |
| Image processing | Trigger Cloud Function on upload for resize, thumbnail generation |
| Metadata | Custom metadata key-value pairs on each file |
| CORS | Configure via `gsutil cors set cors.json gs://bucket` |

---

## 7. Firebase Analytics + Performance

### Analytics (GA4)
- Automatic events: `page_view`, `session_start`, `first_open`
- Custom events: `logEvent('purchase', { value: 9.99, currency: 'USD' })`
- Conversions: Mark any event as conversion in console
- User properties: Custom segmentation dimensions
- BigQuery export: Raw event data for advanced analysis

### Crashlytics
- Automatic crash reporting for web, iOS, Android
- ANR (Application Not Responding) detection
- Non-fatal exceptions: `recordError()`
- Breadcrumbs: `log()` for context before crashes

### Performance Monitoring
- Automatic traces: page load, HTTP requests
- Custom traces: `trace('my_operation')` with metrics
- Network monitoring: latency, payload size, success rate

---

## 8. Firebase Cloud Messaging (FCM)

| Concept | Detail |
|---|---|
| Push notifications | Foreground and background message handling |
| Topics | Subscribe devices to named topics for broadcast |
| Data messages | Silent messages with custom payload (no visible notification) |
| Notification channels | Android channel configuration for grouping |
| Tokens | Per-device registration tokens; refresh via `onTokenRefresh` |
| Admin SDK | `admin.messaging().send({ token, notification, data })` |

---

## 9. Firebase Extensions

Pre-built, configurable solutions installed via console or CLI:

| Extension | Purpose |
|---|---|
| Stripe Payments | Subscription and one-time payment processing |
| SendGrid Email | Transactional email delivery |
| Resize Images | Auto-generate thumbnails on Storage upload |
| Translate Text | Auto-translate Firestore documents |
| Delete User Data | GDPR-compliant user data cleanup on account deletion |
| Export Collections | BigQuery export of Firestore data |

---

## 10. Google Cloud Services

| Service | Use Case |
|---|---|
| Cloud Tasks | Durable async task queues with retry policies |
| Pub/Sub | Event-driven messaging between services |
| Secret Manager | Store API keys, credentials; accessed from Cloud Functions |
| BigQuery | Analytics warehouse; receives GA4 + Firestore exports |
| Cloud Scheduler | Cron jobs triggering HTTP endpoints or Pub/Sub |
| Cloud Run | Containerized services for complex backends |

---

## 11. Google APIs

| API | Version | Common Use |
|---|---|---|
| Sheets API | v4 | Read/write spreadsheet data |
| Docs API | v1 | Generate/modify documents |
| Calendar API | v3 | Create/read events, availability |
| Maps JavaScript API | latest | Embed maps, geocoding, directions |
| YouTube Data API | v3 | Search, video metadata, playlists |

**Auth**: Service account for server-to-server; OAuth 2.0 for user-context access.

---

## 12. SDK Versions

| Package | Minimum Version | Notes |
|---|---|---|
| `firebase` (JS SDK) | v10.x | Modular tree-shakable imports |
| `firebase-admin` | v12.x | Server-side Admin SDK |
| `firebase-tools` | v13.x | CLI for deploy, emulators, init |
| `firebase-functions` | v5.x | 2nd gen function definitions |
| Node.js runtime | v20.x | LTS used in Cloud Functions |

---

*Last updated: 2026-03-21*
