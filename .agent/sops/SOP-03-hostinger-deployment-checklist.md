# SOP-03: Hostinger Deployment Checklist

> Pre-deployment validation and step-by-step deployment to Hostinger hosting.
> Use this checklist for every production deployment of static frontends to Hostinger.

---

## Prerequisites

- Hostinger account with active hosting plan (Business or Cloud recommended)
- SSH access enabled (Business+ plans)
- SFTP credentials configured
- Domain pointed to Hostinger nameservers (or A record set)
- Local project builds successfully

---

## Step 1: Build

Run the production build and verify output.

```bash
# Clean previous builds
rm -rf dist/

# Run production build
npm run build

# Verify build output exists
ls -la dist/
```

**Verify**:
- [ ] Build completes without errors
- [ ] `dist/` (or `build/`) directory contains `index.html`
- [ ] All assets (JS, CSS, images) are present
- [ ] No source maps in production build (unless intentionally included)
- [ ] Environment variables point to production Firebase project

---

## Step 2: Validate

Run automated quality checks against the production build.

### Lighthouse Audit
```bash
# Run Lighthouse CI (requires @lhci/cli)
npx lhci autorun --collect.staticDistDir=./dist

# Or run manually via Chrome DevTools → Lighthouse tab
```

**Thresholds**:
- [ ] Performance score > 90
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 90

### Test Suite
```bash
# Run all tests
npm test

# Run E2E tests against production build
npm run test:e2e
```

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass

### Console Check
- [ ] No console errors in browser DevTools
- [ ] No console warnings (except expected deprecations)
- [ ] No failed network requests

---

## Step 3: Optimize

Apply production optimizations before upload.

### Image Compression
```bash
# Compress images (requires sharp-cli or similar)
npx sharp-cli --input "dist/**/*.{png,jpg,jpeg}" --output dist/ --quality 80

# Or verify build tool already handles this (Vite, Webpack image plugins)
```

- [ ] Images compressed (WebP or AVIF preferred, JPEG/PNG fallback)
- [ ] No images over 200 KB without justification
- [ ] Favicon and social sharing images present

### Asset Optimization
- [ ] CSS minified (build tool handles this)
- [ ] JavaScript minified and tree-shaken
- [ ] Unused CSS removed (PurgeCSS or equivalent)
- [ ] Fonts subset to used characters (if custom fonts)

### Compression
Verify `.htaccess` enables gzip/brotli (create in `dist/` if not present):

```apache
# Enable gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript
  AddOutputFilterByType DEFLATE application/javascript application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# SPA routing — redirect all requests to index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

- [ ] `.htaccess` present in `dist/` with compression, caching, SPA routing, and security headers

---

## Step 4: Upload

Deploy files to Hostinger. Choose one method.

### Option A: SFTP Upload (Recommended)

```bash
# Using lftp (or any SFTP client)
lftp -u {username},{password} sftp://{hostname} <<EOF
mirror --reverse --delete --verbose dist/ /public_html/
bye
EOF

# Or use FileZilla / Cyberduck GUI client:
# 1. Connect to Hostinger via SFTP (port 22)
# 2. Navigate to /public_html/
# 3. Upload contents of dist/ (not the dist/ folder itself)
```

### Option B: Git Push via SSH

```bash
# One-time setup on Hostinger (via SSH):
# mkdir -p ~/repo.git && cd ~/repo.git && git init --bare
# Create post-receive hook to deploy to public_html

# Local push:
git remote add hostinger ssh://{user}@{hostname}/~/repo.git
git push hostinger main
```

### Option C: hPanel File Manager

1. Log in to Hostinger hPanel.
2. Navigate to File Manager.
3. Open `public_html/`.
4. Delete existing files (keep `.htaccess` if not in build).
5. Upload `dist/` contents via drag-and-drop or upload button.

**Verify**:
- [ ] All files uploaded to `/public_html/`
- [ ] `.htaccess` is present in `/public_html/`
- [ ] No stale files from previous deployment remain

---

## Step 5: Configure

Set up domain, SSL, and redirects in Hostinger hPanel.

### Custom Domain
1. Go to hPanel → Domains.
2. Add custom domain (if not already configured).
3. Verify DNS:
   - **A record**: Points to Hostinger server IP.
   - **CNAME**: `www` points to the main domain.

### SSL Certificate
1. Go to hPanel → SSL.
2. Install Let's Encrypt SSL (free).
3. Enable **Force HTTPS** toggle.

### Redirects
1. www → non-www (or vice versa) redirect configured.
2. HTTP → HTTPS redirect active.

- [ ] Custom domain configured and pointing to Hostinger
- [ ] SSL certificate installed and active
- [ ] HTTPS forced
- [ ] www redirect configured

---

## Step 6: Verify

Test the live deployment.

### Functional Verification
- [ ] Homepage loads correctly
- [ ] All routes work (SPA routing via `.htaccess`)
- [ ] Authentication flow works (Firebase Auth)
- [ ] Data loads from Firestore
- [ ] Images and assets load
- [ ] Forms submit correctly
- [ ] No broken links

### DNS Verification
```bash
# Check DNS propagation
dig {domain} A
dig www.{domain} CNAME

# Or use https://dnschecker.org/
```

- [ ] DNS resolves to correct Hostinger IP
- [ ] DNS propagation complete (may take up to 48 hours)

### SSL Verification
```bash
# Check SSL certificate
openssl s_client -connect {domain}:443 -servername {domain} </dev/null 2>/dev/null | openssl x509 -noout -dates

# Or use https://www.ssllabs.com/ssltest/
```

- [ ] SSL certificate valid and not expired
- [ ] No mixed content warnings (HTTP resources on HTTPS page)
- [ ] SSL Labs grade A or higher

---

## Step 7: Monitor

Set up ongoing monitoring after deployment.

### Uptime Monitoring
- Configure uptime check (UptimeRobot, Better Uptime, or similar).
- Set alert threshold: notify if site is down for > 1 minute.
- Monitor both root domain and key API endpoints.

### Error Tracking
- [ ] Firebase Crashlytics enabled and receiving events
- [ ] Browser error monitoring active (Sentry or equivalent, if applicable)

### Performance Monitoring
- [ ] Firebase Performance Monitoring collecting traces
- [ ] Core Web Vitals within acceptable thresholds:
  - LCP < 2.5s
  - INP < 200ms
  - CLS < 0.1

### Alerts
- [ ] Uptime monitoring configured with email/Slack alerts
- [ ] Error rate alerts configured in Firebase Console
- [ ] SSL expiration alert set (30 days before expiry)

---

## Rollback Procedure

If the deployment causes critical issues:

1. **Immediate**: Revert to previous version via SFTP (upload previous `dist/` backup).
2. **If using Git**: `git revert` the deployment commit and re-push.
3. **Firebase services**: Roll back Firestore rules and Cloud Functions via Firebase Console → previous version.
4. **Notify stakeholders** of rollback and timeline for fix.

**Always keep**: A backup of the previous `dist/` before deploying.

---

*Last updated: 2026-03-21*
