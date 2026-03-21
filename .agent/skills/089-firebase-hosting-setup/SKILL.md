---
name: firebase-hosting-setup
description: Firebase Hosting config with rewrites, redirects, headers, preview channels, custom domains, and CDN cache control
version: 1.0.0
status: production
owner: Javier Montaño
tags: [devops, firebase-hosting, cdn, custom-domain, preview-channels, deploy]
---

# 089 — Firebase Hosting Setup {DevOps}

## Purpose
Configure and optimize Firebase Hosting for production-grade web applications. Set up rewrites for SPAs, custom domains, preview channels for PR review, and CDN cache policies for performance.

## Physics — 3 Immutable Laws

1. **Law of CDN First**: Every static asset is served from Firebase's global CDN. Cache headers maximize edge-hit ratio. Origin requests are minimized.
2. **Law of Immutable Deploys**: Each deploy creates an immutable version. Rollback is instant via `firebase hosting:channel:deploy` or version rollback in console.
3. **Law of Preview Before Production**: Every PR gets a preview channel URL. No code reaches production without visual verification on a preview deployment.

## Protocol

### Phase 1 — Hosting Configuration
1. Configure `firebase.json` hosting section:
   - `"public": "dist"` — built output directory.
   - `"rewrites": [{"source": "**", "destination": "/index.html"}]` — SPA routing.
   - `"redirects"` — for legacy URL migrations (301 permanent).
   - `"headers"` — cache control for assets, security headers (CSP, X-Frame-Options).

### Phase 2 — Custom Domain & SSL
1. Add custom domain in Firebase Console → Hosting → Custom Domains.
2. Set A records and TXT verification in DNS provider.
3. Firebase auto-provisions SSL certificate (Let's Encrypt). Wait for propagation (~24h).
4. Verify HTTPS works. Configure `www` redirect if needed.

### Phase 3 — Preview Channels & Deploy
1. PR preview: `firebase hosting:channel:deploy pr-$PR_NUMBER --expires 7d`.
2. Production deploy: `firebase deploy --only hosting`.
3. Cache policy: `"Cache-Control": "public, max-age=31536000"` for hashed assets, `"no-cache"` for `index.html`.

## I/O

| Input | Output |
|-------|--------|
| `firebase.json` hosting config | Configured rewrites, redirects, headers |
| Built `dist/` directory | Deployed files on Firebase CDN |
| Custom domain + DNS records | SSL-enabled custom domain |
| PR number | Preview channel URL (expires in 7d) |

## Quality Gates — 5 Checks

1. **SPA rewrite configured** — all routes return `index.html`.
2. **Security headers present** — CSP, X-Content-Type-Options, X-Frame-Options.
3. **Cache headers optimized** — hashed assets get 1-year cache, HTML gets no-cache.
4. **Custom domain SSL active** — HTTPS enforced, no mixed content.
5. **Preview channels work** — PR deploys produce accessible preview URLs.

## Edge Cases

- **Multi-site hosting**: Use `"site"` field in `firebase.json` for multiple sites in one project.
- **Cloud Functions rewrites**: `"rewrites": [{"source": "/api/**", "function": "api"}]` for SSR or API.
- **i18n routing**: Configure `"i18n"` in hosting config for language-based content serving.
- **Large files**: Firebase Hosting has 2GB per-file limit. Use Storage for larger assets.

## Self-Correction Triggers

- 404 on refresh → SPA rewrite missing. Add catch-all rewrite to `index.html`.
- Stale content after deploy → `index.html` has aggressive cache. Set `no-cache` on HTML.
- SSL not provisioning → DNS records incorrect. Verify A record and TXT record values.
- Preview channel expired → increase `--expires` duration or redeploy.
