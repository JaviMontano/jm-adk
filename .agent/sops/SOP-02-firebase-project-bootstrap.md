# SOP-02: Firebase Project Bootstrap

> Standard procedure for initializing a new Firebase project from scratch.
> Follow every step in order. Do not skip steps even if a service seems unnecessary — it is easier to disable later than to retrofit.

---

## Prerequisites

- Node.js 20.x installed
- Google account with Firebase access
- `firebase-tools` CLI installed: `npm install -g firebase-tools`
- Authenticated: `firebase login`

---

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**.
3. Name the project following the convention: `{client}-{project}-{env}` (e.g., `acme-portal-dev`).
4. Enable Google Analytics (select or create a GA4 property).
5. Wait for project provisioning to complete.

**Repeat** for staging and production environments:
- `{client}-{project}-dev`
- `{client}-{project}-staging`
- `{client}-{project}-prod`

---

## Step 2: Enable Firebase Services

In the Firebase Console for each project, enable:

| Service | Console Path | Notes |
|---|---|---|
| Authentication | Build → Authentication → Get started | Enable at least Email/Password |
| Firestore | Build → Firestore Database → Create database | Start in **test mode** for dev, **production mode** for staging/prod |
| Cloud Functions | Build → Functions → Get started | Requires Blaze (pay-as-you-go) plan |
| Hosting | Build → Hosting → Get started | — |
| Storage | Build → Storage → Get started | — |
| Analytics | Already enabled if selected in Step 1 | — |
| Crashlytics | Release & Monitor → Crashlytics | — |
| Performance | Release & Monitor → Performance | — |

---

## Step 3: Initialize Local Project

```bash
# Create project directory
mkdir {project-name} && cd {project-name}

# Initialize Firebase
firebase init

# Select services (space to toggle, enter to confirm):
# ◉ Firestore
# ◉ Functions
# ◉ Hosting
# ◉ Storage
# ◉ Emulators

# Select the dev project as default
# Accept default file names for rules and indexes
```

**Functions configuration**:
- Language: **TypeScript**
- ESLint: **Yes**
- Install dependencies: **Yes**

**Hosting configuration**:
- Public directory: `dist` (or `build` depending on framework)
- Single-page app: **Yes**
- GitHub Actions deploy: **No** (configure manually later)

**Emulators**:
- Select: Auth, Functions, Firestore, Hosting, Storage, Pub/Sub
- Accept default ports or customize

---

## Step 4: Configure Firestore Security Rules

Edit `firestore.rules`:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Default: deny all
    match /{document=**} {
      allow read, write: if false;
    }

    // Users collection — users can read/write their own document
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null
        && request.auth.token.role == 'admin';
    }
  }
}
```

---

## Step 5: Configure Storage Security Rules

Edit `storage.rules`:

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    // Default: deny all
    match /{allPaths=**} {
      allow read, write: if false;
    }

    // User uploads — scoped to their UID
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 10 * 1024 * 1024  // 10 MB limit
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## Step 6: Set Up Firebase Auth Providers

In Firebase Console → Authentication → Sign-in method, enable:

| Provider | Required Config |
|---|---|
| Email/Password | Enable; optionally enable email link sign-in |
| Google | OAuth client ID auto-configured |
| GitHub | Register OAuth app at github.com → Settings → Developer settings |
| Apple | Apple Developer account, Service ID, private key |

Configure authorized domains:
- `localhost` (dev)
- `{project}.web.app` (Firebase Hosting)
- Custom production domain

---

## Step 7: Configure Hosting Rewrites

Edit `firebase.json` hosting section:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|avif)",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
        ]
      }
    ]
  }
}
```

---

## Step 8: Set Environment Variables

For Cloud Functions, use parameterized configuration:

```typescript
// functions/src/config.ts
import { defineString, defineSecret } from 'firebase-functions/params';

export const STRIPE_KEY = defineSecret('STRIPE_KEY');
export const SENDGRID_KEY = defineSecret('SENDGRID_KEY');
export const APP_ENV = defineString('APP_ENV', { default: 'development' });
```

Set secrets:
```bash
firebase functions:secrets:set STRIPE_KEY
firebase functions:secrets:set SENDGRID_KEY
```

---

## Step 9: Configure Firebase Emulator Suite

Verify `firebase.json` emulators section:

```json
{
  "emulators": {
    "auth": { "port": 9099 },
    "functions": { "port": 5001 },
    "firestore": { "port": 8080 },
    "hosting": { "port": 5000 },
    "storage": { "port": 9199 },
    "pubsub": { "port": 8085 },
    "ui": { "enabled": true, "port": 4000 }
  }
}
```

Start emulators:
```bash
firebase emulators:start

# With data import/export for persistence:
firebase emulators:start --import=./emulator-data --export-on-exit=./emulator-data
```

---

## Step 10: Configure CI/CD with GitHub Actions

Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run tests
        run: npm test

      - name: Deploy to Firebase (PR preview)
        if: github.event_name == 'pull_request'
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: ${{ vars.FIREBASE_PROJECT_ID }}

      - name: Deploy to Firebase (production)
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: ${{ vars.FIREBASE_PROJECT_ID }}
          channelId: live
```

---

## Step 11: Create Multi-Environment Setup

Add project aliases in `.firebaserc`:

```json
{
  "projects": {
    "default": "{client}-{project}-dev",
    "staging": "{client}-{project}-staging",
    "production": "{client}-{project}-prod"
  }
}
```

Switch environments:
```bash
firebase use default     # dev
firebase use staging     # staging
firebase use production  # prod
```

---

## Post-Bootstrap Checklist

- [ ] Firebase project created for dev, staging, prod
- [ ] All required services enabled
- [ ] Local project initialized with `firebase init`
- [ ] Firestore security rules written and deployed
- [ ] Storage security rules written and deployed
- [ ] Auth providers configured
- [ ] Hosting rewrites configured for SPA
- [ ] Environment variables / secrets set
- [ ] Emulator Suite running locally
- [ ] CI/CD pipeline configured
- [ ] `.firebaserc` has all project aliases
- [ ] `README.md` updated with setup instructions

---

*Last updated: 2026-03-21*
