# Hostinger Constraints & Workarounds

> Standard hosting limitations for Hostinger plans and recommended workarounds using Firebase services.

---

## Supported Technologies

| Technology | Hostinger Support | Notes |
|---|---|---|
| Static HTML/CSS/JS | All plans | Upload to `public_html/` |
| PHP | 8.0, 8.1, 8.2, 8.3 | All shared and business plans |
| Node.js | 18, 20 | VPS and Cloud plans only |
| Python | 3.x | VPS plans only |
| MySQL | 8.x | All plans; phpMyAdmin included |
| PostgreSQL | 15.x | VPS plans only |

---

## Not Supported on Hostinger

| Technology | Workaround |
|---|---|
| Docker | Use Firebase Cloud Functions or Cloud Run |
| Kubernetes | Use Firebase Cloud Functions or Cloud Run |
| Serverless functions | Use Firebase Cloud Functions (Node.js 20) |
| WebSocket servers | Use Firebase RTDB or Firestore real-time listeners |
| Background workers | Use Cloud Tasks or Cloud Functions scheduled triggers |
| Custom runtimes | Use Cloud Run for containerized workloads |

---

## File & Upload Limits

| Constraint | Limit |
|---|---|
| File Manager upload | 256 MB per file |
| SSH/SFTP upload | No practical limit (disk quota applies) |
| Disk quota (shared) | Plan-dependent (50 GB–200 GB typical) |
| Inodes (shared) | Plan-dependent (typically 400K–600K) |
| Bandwidth | Unmetered on most plans |

---

## Access & Management

### SSH Access
- Available on **Business** and **Cloud** plans
- Key-based authentication supported
- Use for Git deployment, SFTP, and CLI operations

### hPanel (Control Panel)
- File Manager — browser-based file upload and editing
- Domain management — add, configure, point domains
- SSL — free Let's Encrypt; custom certificate upload
- Email — create email accounts on custom domains
- Databases — MySQL management, phpMyAdmin
- Cron Jobs — schedule PHP/shell scripts
- Backups — automatic daily backups with restore

---

## Node.js Hosting (VPS / Cloud)

- **Process manager**: PM2 (pre-installed on VPS)
- **Startup script**: Configure via PM2 ecosystem file
- **Port binding**: Reverse proxy from Nginx to Node.js port
- **Environment variables**: Set via `.env` file or PM2 config
- **Logs**: `pm2 logs` for stdout/stderr

---

## Static Site Deployment Workflow

```
1. Build locally
   $ npm run build

2. Upload dist/ to Hostinger
   Option A: SFTP upload to public_html/
   Option B: Git push via SSH (set up bare repo + post-receive hook)
   Option C: hPanel File Manager (drag and drop)

3. Configure domain
   - Point domain A record to Hostinger IP
   - Or use Hostinger nameservers for full DNS management

4. Enable SSL
   - Activate Let's Encrypt from hPanel → SSL section
   - Force HTTPS via .htaccess or hPanel toggle
```

---

## CDN & Performance

| Feature | Detail |
|---|---|
| Cloudflare integration | Available; configure via Hostinger hPanel |
| Built-in CDN | Hostinger CDN available on Business+ plans |
| Caching | Browser caching via `.htaccess` or custom headers |
| Gzip/Brotli | Enable via `.htaccess` or Hostinger settings |
| HTTP/2 | Enabled by default on all plans |

---

## SSL / TLS

| Type | Detail |
|---|---|
| Free SSL | Let's Encrypt auto-renewal |
| Custom SSL | Upload custom certificate via hPanel |
| Wildcard SSL | Available on Business+ plans |
| Force HTTPS | Toggle in hPanel or via `.htaccess` |

---

## Domain Configuration

- **Custom domains**: Unlimited on Business+ plans
- **Subdomains**: Create via hPanel
- **DNS management**: A, CNAME, MX, TXT, SRV records
- **Domain parking**: Point multiple domains to same site
- **Redirects**: 301/302 via `.htaccess` or hPanel

---

## Database Strategy

| Data Type | Recommended Store | Reason |
|---|---|---|
| Application data | Firestore | Real-time sync, offline support, security rules |
| User sessions | Firebase Auth | Managed tokens, no server-side session store needed |
| Analytics | BigQuery | GA4 export, custom event analysis |
| Relational data (if required) | Hostinger MySQL | phpMyAdmin access, familiar SQL |
| File storage | Cloud Storage for Firebase | CDN-backed, security rules, processing triggers |

**Principle**: Use Hostinger MySQL only when relational queries are strictly necessary. Default to Firestore for application data.

---

## Recommended Architecture

```
┌─────────────────────┐     ┌──────────────────────┐
│   Hostinger          │     │   Firebase / GCP      │
│                     │     │                      │
│  Static frontend    │────▶│  Firebase Auth       │
│  (HTML/CSS/JS)      │     │  Firestore           │
│  served from CDN    │     │  Cloud Functions     │
│                     │     │  Cloud Storage       │
│  .htaccess config   │     │  FCM                 │
│  SSL termination    │     │  Analytics           │
└─────────────────────┘     └──────────────────────┘
```

- **Hostinger** handles: static file serving, domain/SSL, CDN edge
- **Firebase** handles: auth, database, serverless compute, file storage, push notifications

---

*Last updated: 2026-03-21*
